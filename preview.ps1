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
$headerLine = ($headers | ForEach-Object { $_.PadRight($widths[$_]) }) -join ' | '
$sepLine = ($headers | ForEach-Object { '-' * $widths[$_] }) -join '-+-'
Write-Output $headerLine
Write-Output $sepLine

# Imprime linhas
foreach ($r in $rows) {
    $line = ($headers | ForEach-Object {
        $val = $r.$_
        if ($null -eq $val) { '' } else { $val.ToString() }
    } | ForEach-Object { $_.PadRight($widths[$headers[$PSIndex]]) }) -join ' | '
    Write-Output $line
}