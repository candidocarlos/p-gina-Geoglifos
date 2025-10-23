# Lê e exibe features.csv como uma tabela formatada
$csvPath = Join-Path $PSScriptRoot 'features.csv'

# Verifica se arquivo existe
if (-Not (Test-Path $csvPath)) {
    Write-Error "Arquivo não encontrado: $csvPath"
    exit 1
}

# Lê CSV (UTF-8)
$rows = Import-Csv -Path $csvPath -Encoding UTF8

# Verifica se há dados
if (-not $rows -or $rows.Count -eq 0) {
    Write-Output "Nenhuma linha encontrada no CSV."
    exit 0
}

# Obtém cabeçalhos
$headers = $rows[0].PSObject.Properties | Select-Object -ExpandProperty Name

# Calcula larguras das colunas
$widths = @{}
foreach ($h in $headers) {
    $max = $h.Length
    foreach ($r in $rows) {
        $val = $r.$h
        if ($null -eq $val) { $len = 0 } else { $len = $val.ToString().Length }
        if ($len -gt $max) { $max = $len }
    }
    $widths[$h] = $max
}

# Imprime cabeçalho
$headerParts = @()
$sepParts = @()
foreach ($h in $headers) {
    $headerParts += $h.PadRight($widths[$h])
    $sepParts += '-' * $widths[$h]
}

Write-Output ($headerParts -join ' | ')
Write-Output ($sepParts -join '-+-')

# Imprime linhas
foreach ($r in $rows) {
    $parts = @()
    foreach ($h in $headers) {
        $val = $r.$h
        if ($null -eq $val) { $s = '' } else { $s = $val.ToString() }
        $parts += $s.PadRight($widths[$h])
    }
    Write-Output ($parts -join ' | ')
}