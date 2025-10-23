"""Servidor HTTP simples que fornece:

- GET  /api/features -> lista de features extraída de features.csv (JSON)
- POST /api/report   -> aceita formulário multipart com foto e campos, salva em data/reports.jsonl
- serve arquivos estáticos (index.html, static/*)

Implementado apenas com a biblioteca padrão para evitar dependências externas.
"""

from http.server import HTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import json
import csv
import cgi
import shutil
import uuid
from datetime import datetime


ROOT = Path(__file__).parent.resolve()
DATA_DIR = ROOT / "data"
UPLOADS_DIR = DATA_DIR / "uploads"
REPORTS_FILE = DATA_DIR / "reports.jsonl"


def ensure_data_dirs():
	DATA_DIR.mkdir(exist_ok=True)
	UPLOADS_DIR.mkdir(exist_ok=True)
	if not REPORTS_FILE.exists():
		REPORTS_FILE.write_text("")


def load_features():
	csv_path = ROOT / "features.csv"
	if not csv_path.exists():
		return []
	with csv_path.open("r", encoding="utf-8") as f:
		reader = csv.DictReader(f)
		return list(reader)


class Handler(SimpleHTTPRequestHandler):
	def _set_json_headers(self, status=200):
		self.send_response(status)
		self.send_header("Content-Type", "application/json; charset=utf-8")
		self.send_header("Access-Control-Allow-Origin", "*")
		self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		self.send_header("Access-Control-Allow-Headers", "Content-Type")
		self.end_headers()

	def do_OPTIONS(self):
		# Reply to CORS preflight
		self.send_response(200)
		self.send_header("Access-Control-Allow-Origin", "*")
		self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		self.send_header("Access-Control-Allow-Headers", "Content-Type")
		self.end_headers()

	def do_GET(self):
		if self.path.startswith("/api/features"):
			features = load_features()
			self._set_json_headers(200)
			self.wfile.write(json.dumps(features, ensure_ascii=False).encode("utf-8"))
			return

		# Serve index for root
		if self.path == "/":
			self.path = "/index.html"

		return super().do_GET()

	def do_POST(self):
		if self.path.startswith("/api/report"):
			# parse multipart/form-data using cgi.FieldStorage
			ctype, pdict = cgi.parse_header(self.headers.get("content-type", ""))
			if ctype == "multipart/form-data":
				pdict["boundary"] = pdict["boundary"].encode("utf-8")
			fs = cgi.FieldStorage(fp=self.rfile, headers=self.headers, environ={
				'REQUEST_METHOD': 'POST'
			}, keep_blank_values=True)

			# Extract expected fields
			name = fs.getvalue("name") or ""
			anonymous = fs.getvalue("anonymous") in ("on", "true", "1")
			description = fs.getvalue("description") or ""
			lat = fs.getvalue("lat") or ""
			lon = fs.getvalue("lon") or ""

			photo_field = fs["photo"] if "photo" in fs else None
			photo_filename = ""
			if photo_field and getattr(photo_field, "filename", None):
				raw = photo_field.file.read()
				ext = Path(photo_field.filename).suffix
				photo_filename = f"{datetime.utcnow().strftime('%Y%m%dT%H%M%SZ')}_{uuid.uuid4().hex}{ext}"
				dest = UPLOADS_DIR / photo_filename
				with open(dest, "wb") as out:
					out.write(raw)

			report = {
				"id": uuid.uuid4().hex,
				"timestamp": datetime.utcnow().isoformat() + "Z",
				"name": name if not anonymous else "__ANON__",
				"anonymous": anonymous,
				"description": description,
				"lat": lat,
				"lon": lon,
				"photo": f"/data/uploads/{photo_filename}" if photo_filename else "",
			}

			# append as jsonl
			with open(REPORTS_FILE, "a", encoding="utf-8") as rf:
				rf.write(json.dumps(report, ensure_ascii=False) + "\n")

			self._set_json_headers(201)
			self.wfile.write(json.dumps({"status": "ok", "report_id": report["id"]}, ensure_ascii=False).encode("utf-8"))
			return

		# fallback
		self.send_error(404, "Not Found")


def run(host: str = "0.0.0.0", port: int = 8000):
	ensure_data_dirs()
	server = HTTPServer((host, port), Handler)
	print(f"Servidor rodando em http://{host}:{port}/ — Ctrl-C para parar")
	try:
		server.serve_forever()
	except KeyboardInterrupt:
		print("Interrompido pelo usuário")
	finally:
		server.server_close()


if __name__ == "__main__":
	run()

