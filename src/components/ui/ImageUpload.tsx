import { useRef, useState, type DragEvent } from 'react'
import { ImagePlus, Loader2, Trash2, Upload } from 'lucide-react'
import { cn, fileToDataUrl } from '../../lib/utils'
import { toast } from '../../store/useToast'

interface Props {
  value?: string
  onChange: (value: string | undefined) => void
  aspect?: 'square' | 'wide' | 'logo'
  maxSize?: number
  label?: string
  className?: string
}

export function ImageUpload({ value, onChange, aspect = 'wide', maxSize = 900, label = 'Tap to upload image', className }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [drag, setDrag] = useState(false)

  const handle = async (file?: File) => {
    if (!file) return
    setBusy(true)
    try {
      onChange(await fileToDataUrl(file, maxSize))
    } catch (e) {
      toast((e as Error).message, 'error')
    } finally {
      setBusy(false)
    }
  }

  const onDrop = (e: DragEvent) => {
    e.preventDefault()
    setDrag(false)
    handle(e.dataTransfer.files?.[0])
  }

  const ratio = aspect === 'square' ? 'aspect-square' : aspect === 'logo' ? 'size-24' : 'aspect-[16/7]'

  return (
    <div className={className}>
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={(e) => handle(e.target.files?.[0])} />
      {value ? (
        <div className={cn('group relative overflow-hidden rounded-2xl border border-line bg-brand-50', ratio)}>
          <img src={value} alt="" className={cn('size-full', aspect === 'logo' ? 'object-contain p-2' : 'object-cover')} />
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-ink/45 opacity-0 transition group-hover:opacity-100 focus-within:opacity-100">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-ink"
            >
              <Upload className="size-3.5" /> {aspect === 'logo' ? '' : 'Replace'}
            </button>
            <button
              type="button"
              onClick={() => onChange(undefined)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-red-600"
              aria-label="Remove image"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault()
            setDrag(true)
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={onDrop}
          className={cn(
            'flex w-full flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed text-center transition',
            drag ? 'border-brand-500 bg-brand-100' : 'border-brand-200 bg-brand-50/60 hover:border-brand-400 hover:bg-brand-50',
            ratio,
          )}
        >
          {busy ? (
            <Loader2 className="size-6 animate-spin text-brand-600" />
          ) : (
            <>
              <ImagePlus className="size-6 text-brand-700" strokeWidth={1.6} />
              {aspect !== 'logo' && (
                <>
                  <span className="text-sm font-medium text-ink">{label}</span>
                  <span className="text-xs text-muted">JPG, PNG, WebP · Max 8MB</span>
                </>
              )}
            </>
          )}
        </button>
      )}
    </div>
  )
}
