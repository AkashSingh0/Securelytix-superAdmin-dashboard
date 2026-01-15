"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Upload, FileText, Trash2, AlertCircle, X } from "lucide-react"

export interface FileUploadProps {
  label: string
  required?: boolean
  file: File | null
  existingFileName?: string | null
  onFileChange: (file: File | null) => void
  error?: string
  accept?: string
  maxSize?: number // in bytes
  description?: string
}

export function FileUpload({
  label,
  required,
  file,
  existingFileName,
  onFileChange,
  error,
  accept = ".pdf",
  maxSize = 2 * 1024 * 1024, // 2MB default
  description = "PDF files only (Max 2MB)",
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
    if (selectedFile) {
      // Validate file size
      if (selectedFile.size > maxSize) {
        onFileChange(null)
        return
      }
      // Validate file type for PDF
      if (accept === ".pdf" && selectedFile.type !== "application/pdf") {
        onFileChange(null)
        return
      }
    }
    onFileChange(selectedFile)
    // Reset input so same file can be selected again
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  const displayName = file?.name || existingFileName
  const isExistingFile = !file && existingFileName

  return (
    <div className="space-y-2">
      <Label>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />

      {!displayName ? (
        <div
          onClick={handleClick}
          className={`
            border-2 border-dashed rounded-lg p-6 cursor-pointer transition-all
            hover:border-primary hover:bg-primary/5
            ${error ? "border-red-500 bg-red-50" : "border-muted-foreground/25"}
          `}
        >
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Click to upload</p>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`border rounded-lg p-4 ${
            isExistingFile
              ? "bg-muted/30 border-muted"
              : "bg-green-50 border-green-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                  isExistingFile ? "bg-muted" : "bg-green-100"
                }`}
              >
                <FileText
                  className={`h-5 w-5 ${
                    isExistingFile ? "text-muted-foreground" : "text-green-600"
                  }`}
                />
              </div>
              <div>
                <p
                  className={`text-sm font-medium ${
                    isExistingFile ? "text-foreground" : "text-green-800"
                  }`}
                >
                  {displayName}
                </p>
                <p
                  className={`text-xs ${
                    isExistingFile ? "text-muted-foreground" : "text-green-600"
                  }`}
                >
                  {file
                    ? `${(file.size / 1024).toFixed(1)} KB • PDF`
                    : "Existing file"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isExistingFile && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleClick}
                  className="text-xs"
                >
                  Replace
                </Button>
              )}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onFileChange(null)}
                className={`h-8 w-8 ${
                  isExistingFile
                    ? "text-muted-foreground hover:text-destructive"
                    : "text-red-500 hover:text-red-700 hover:bg-red-100"
                }`}
              >
                {isExistingFile ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
    </div>
  )
}

