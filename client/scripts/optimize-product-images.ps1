# Resize product photos for web — full (max 1400px) + card (max 600px) variants
Add-Type -AssemblyName System.Drawing

function Save-Jpeg($bitmap, $path, [int]$quality) {
  $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
    Where-Object { $_.MimeType -eq 'image/jpeg' } |
    Select-Object -First 1
  $encParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
  $encParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
    [System.Drawing.Imaging.Encoder]::Quality,
    [long]$quality
  )
  $bitmap.Save($path, $codec, $encParams)
}

function Resize-Image($sourcePath, $maxSize) {
  $img = [System.Drawing.Image]::FromFile($sourcePath)
  try {
    $ratioW = $maxSize / $img.Width
    $ratioH = $maxSize / $img.Height
    $ratio = [Math]::Min($ratioW, $ratioH)
    if ($ratio -gt 1) { $ratio = 1 }
    $width = [Math]::Max(1, [int][Math]::Round($img.Width * $ratio))
    $height = [Math]::Max(1, [int][Math]::Round($img.Height * $ratio))
    $bmp = New-Object System.Drawing.Bitmap $width, $height
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.DrawImage($img, 0, 0, $width, $height)
    $g.Dispose()
    return $bmp
  }
  finally {
    $img.Dispose()
  }
}

$root = Join-Path $PSScriptRoot '..\public\products' | Resolve-Path
$totalBefore = 0
$totalAfter = 0

Get-ChildItem $root -Directory | Where-Object { $_.Name -notlike '_*' } | ForEach-Object {
  Get-ChildItem $_.FullName -File | Where-Object {
    $_.Extension -match '^\.(jpe?g|png)$' -and $_.Name -notmatch '-card\.'
  } | ForEach-Object {
    $file = $_
    $totalBefore += $file.Length
    $ext = $file.Extension.ToLowerInvariant()
    $cardPath = Join-Path $file.DirectoryName ($file.BaseName + '-card' + $ext)

    $full = Resize-Image $file.FullName 1400
    $card = Resize-Image $file.FullName 600

    try {
      if ($ext -eq '.png') {
        $full.Save($file.FullName, [System.Drawing.Imaging.ImageFormat]::Png)
        $card.Save($cardPath, [System.Drawing.Imaging.ImageFormat]::Png)
      }
      else {
        Save-Jpeg $full $file.FullName 82
        Save-Jpeg $card $cardPath 78
      }
      $totalAfter += (Get-Item $file.FullName).Length
      $totalAfter += (Get-Item $cardPath).Length
      Write-Output ("Optimized {0}" -f $file.Name)
    }
    finally {
      $full.Dispose()
      $card.Dispose()
    }
  }
}

Write-Output ("Reduced ~{0:N1} MB to ~{1:N1} MB" -f ($totalBefore/1MB), ($totalAfter/1MB))
