'use client'
import React , { createContext, useContext, useState }  from 'react'
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogCancel,
  } from "@/components/ui/alert-dialog"

  import { Button } from "@/components/ui/button"

  type ConfirmOptions = {
    title?: string
    description?: string
    confirmText?: string
    cancelText?: string
  }
  // Xác định kiểu hàm confirm
type ConfirmFunction = (options: ConfirmOptions) => Promise<boolean>

// Tạo Context
const ConfirmContext = createContext<ConfirmFunction | null>(null)
export function ConfirmProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false)
    const [options, setOptions] = useState<ConfirmOptions>({})
    const [resolver, setResolver] = useState<(value: boolean) => void>(() => {})
  
    /**
     * Hàm confirm() - trả về Promise<boolean>
     */
    const confirm = (opts: ConfirmOptions) => {
      setOptions(opts)
      setOpen(true)
      // Trả về Promise<boolean>, lưu `resolve` để dùng khi người dùng chọn Yes / No
      return new Promise<boolean>((resolve) => {
        setResolver(() => resolve)
      })
    }
  
    /**
     * Người dùng bấm Cancel
     */
    function handleCancel() {
      setOpen(false)
      resolver(false)
    }
  
    /**
     * Người dùng bấm Confirm
     */
    function handleConfirm() {
      setOpen(false)
      resolver(true)
    }
  
    return (
      <ConfirmContext.Provider value={confirm}>
        {children}
  
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{options.title ?? "Are you sure?"}</AlertDialogTitle>
              <AlertDialogDescription>
                {options.description ?? "This action cannot be undone."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              {/* Nút Cancel */}
              <AlertDialogCancel onClick={handleCancel}>
                {options.cancelText ?? "No"}
              </AlertDialogCancel>
  
              {/* Nút Confirm */}
              <Button variant="default" onClick={handleConfirm}>
                {options.confirmText ?? "Yes"}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </ConfirmContext.Provider>
    )
  }
  
  /**
   * Hook để gọi confirm()
   */
  export function useConfirm() {
    const context = useContext(ConfirmContext)
    if (!context) {
      throw new Error("useConfirm must be used within a ConfirmProvider")
    }
    return context
  }
