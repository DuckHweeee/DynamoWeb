"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface FlexibleComboboxProps<T> {
    options: T[]
    value: string
    onChange: (value: string) => void
    allowCustom?: boolean
    displayField: keyof T
    valueField: keyof T
    placeholder?: string
}

export function FlexibleCombobox<T>({
    options,
    value,
    onChange,
    allowCustom = false,
    displayField,
    valueField,
    placeholder = "Chọn hoặc nhập...",
}: FlexibleComboboxProps<T>) {
    const [open, setOpen] = React.useState(false)
    const [inputValue, setInputValue] = React.useState("")

    const selectedItem = options.find(
        (item) => String(item[valueField]) === value
    )

    const filteredOptions = options.filter((item) =>
        String(item[displayField]).toLowerCase().includes(inputValue.toLowerCase())
    )

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between text-lg"
                >
                    <span
                        className={
                            !selectedItem && !value ? "font-normal text-gray-300" : ""
                        }
                    >
                        {selectedItem
                            ? String(selectedItem[displayField])
                            : value
                                ? value
                                : placeholder}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[390px] p-0" align="start">
                <Command>
                    <CommandInput
                        placeholder={placeholder}
                        value={inputValue}
                        onValueChange={setInputValue}
                        className="text-[16px]"
                    />
                    <CommandEmpty>
                        {allowCustom
                            ? `Không tìm thấy. Nhấn Enter để chọn: "${inputValue}"`
                            : "Không tìm thấy"}
                    </CommandEmpty>

                    {/* Quan trọng: thêm overflow-y-auto + max-h */}
                    <div
                        className="max-h-60 overflow-y-auto"
                        onWheel={(e) => e.stopPropagation()} // tránh Radix chặn cuộn
                    >
                        <CommandGroup>
                            {filteredOptions.map((item) => {
                                const itemValue = String(item[valueField])
                                return (
                                    <CommandItem
                                        key={itemValue}
                                        value={itemValue}
                                        onSelect={() => {
                                            onChange(itemValue)
                                            setOpen(false)
                                            setInputValue("")
                                        }}
                                        className="text-xl"
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                value === itemValue ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {String(item[displayField])}
                                    </CommandItem>
                                )
                            })}

                            {allowCustom &&
                                inputValue &&
                                !filteredOptions.some(
                                    (item) =>
                                        String(item[displayField]).toLowerCase() ===
                                        inputValue.toLowerCase()
                                ) && (
                                    <CommandItem
                                        onSelect={() => {
                                            onChange(inputValue)
                                            setOpen(false)
                                            setInputValue("")
                                        }}
                                        className="text-lg"
                                    >
                                        Thêm ngoài danh sách: {inputValue}
                                    </CommandItem>
                                )}
                        </CommandGroup>
                    </div>
                </Command>
            </PopoverContent>


        </Popover>
    )
}
