/** Helpers to export the QR code SVG rendered by qrcode.react. */

export const qrLogoDataUrl = (color: string) =>
  'data:image/svg+xml;charset=utf-8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="${color}"/><path d="M7 12V9a2 2 0 0 1 2-2h3M20 7h3a2 2 0 0 1 2 2v3M25 20v3a2 2 0 0 1-2 2h-3M12 25H9a2 2 0 0 1-2-2v-3" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/><rect x="11" y="11" width="4" height="4" rx="1" fill="#fff"/><rect x="17" y="11" width="4" height="4" rx="1" fill="#fff"/><rect x="11" y="17" width="4" height="4" rx="1" fill="#fff"/><rect x="17" y="17" width="4" height="4" rx="1" fill="#fff" opacity=".55"/></svg>`,
  )

function serialize(svg: SVGSVGElement) {
  const clone = svg.cloneNode(true) as SVGSVGElement
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  return new XMLSerializer().serializeToString(clone)
}

function trigger(href: string, filename: string) {
  const a = document.createElement('a')
  a.href = href
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
}

export function downloadSvg(svg: SVGSVGElement, filename: string) {
  const blob = new Blob([serialize(svg)], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  trigger(url, `${filename}.svg`)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export function downloadPng(svg: SVGSVGElement, filename: string, size = 1200) {
  return new Promise<void>((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const pad = Math.round(size * 0.06)
      const canvas = document.createElement('canvas')
      canvas.width = canvas.height = size + pad * 2
      const ctx = canvas.getContext('2d')!
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, pad, pad, size, size)
      trigger(canvas.toDataURL('image/png'), `${filename}.png`)
      resolve()
    }
    img.onerror = reject
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(serialize(svg))
  })
}

export function printTableCard(svg: SVGSVGElement, opts: { restaurant: string; url: string; accent: string }) {
  const w = window.open('', '_blank', 'width=640,height=820')
  if (!w) return false
  const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!)
  w.document.write(`<!doctype html><html><head><title>${esc(opts.restaurant)} — Table card</title>
<style>
  @page { size: A6; margin: 0 }
  body { margin:0; font-family: Georgia, serif; display:flex; align-items:center; justify-content:center; min-height:100vh; background:#f5f3fc }
  .card { width: 90mm; padding: 10mm 8mm; background:#fff; border-radius: 6mm; text-align:center; box-shadow: 0 10px 40px rgba(0,0,0,.08) }
  h1 { font-weight: 500; font-size: 26pt; margin: 0 0 2mm }
  .qr svg { width: 60mm; height: 60mm }
  .cta { font-family: system-ui, sans-serif; font-size: 12pt; font-weight: 600; margin-top: 4mm; color:#1b1735 }
  .line { width: 18mm; height: 2px; background:${opts.accent}; margin: 3mm auto 0; border-radius: 2px }
  .url { font-family: system-ui, sans-serif; font-size: 7pt; color: #777; margin-top: 3mm; word-break: break-all }
  @media print { body { background:#fff } .card { box-shadow:none } }
</style></head><body><div class="card"><h1>${esc(opts.restaurant)}</h1><div class="qr">${serialize(svg)}</div>
<div class="cta">Scan for Menu</div><div class="line"></div><div class="url">${esc(opts.url)}</div></div>
<script>setTimeout(()=>{window.print()},400)</script></body></html>`)
  w.document.close()
  return true
}
