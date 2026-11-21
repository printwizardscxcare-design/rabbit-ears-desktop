$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
# Rebuild Windows sizes from the approved PNG. Never redraw the logo here.
$assetDirectory = Join-Path $PSScriptRoot '../assets'
$source = [System.Drawing.Bitmap]::FromFile((Join-Path $assetDirectory 'icon.png'))
$images = @()
try {
  foreach ($size in @(16,24,32,48,64,128,256)) {
    $bitmap = New-Object System.Drawing.Bitmap $size,$size
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $stream = New-Object System.IO.MemoryStream
    try {
      $graphics.Clear([System.Drawing.Color]::Transparent)
      $graphics.InterpolationMode = 'NearestNeighbor'
      $graphics.PixelOffsetMode = 'Half'
      $graphics.DrawImage($source,0,0,$size,$size)
      $bitmap.Save($stream,[System.Drawing.Imaging.ImageFormat]::Png)
      $images += ,@{Size=$size; Bytes=$stream.ToArray()}
    } finally { $graphics.Dispose(); $bitmap.Dispose(); $stream.Dispose() }
  }
  $writer = New-Object System.IO.BinaryWriter ([System.IO.File]::Create((Join-Path $assetDirectory 'icon.ico')))
  try {
    $writer.Write([uint16]0); $writer.Write([uint16]1); $writer.Write([uint16]$images.Count)
    $offset = 6 + 16 * $images.Count
    foreach ($entry in $images) {
      $dimension = if ($entry.Size -eq 256) { 0 } else { $entry.Size }
      $writer.Write([byte]$dimension); $writer.Write([byte]$dimension)
      $writer.Write([byte]0); $writer.Write([byte]0)
      $writer.Write([uint16]1); $writer.Write([uint16]32)
      $writer.Write([uint32]$entry.Bytes.Length); $writer.Write([uint32]$offset)
      $offset += $entry.Bytes.Length
    }
    foreach ($entry in $images) { $writer.Write([byte[]]$entry.Bytes) }
  } finally { $writer.Dispose() }
} finally { $source.Dispose() }
