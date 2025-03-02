"use client";

import * as React from "react";
import { X, ChevronsUpDown, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Command, CommandGroup, CommandItem, CommandList, CommandInput, CommandEmpty } from "@/components/ui/command";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { FormControl } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Module } from "../modules-page/module-context";
import { useEffect } from "react";

interface MultiSelectProps {
    data: Module[];
    field: {
        value: number[];
        onChange: (value: number[]) => void;
    };
    isEditing: boolean;
    selectedYearId: number;
}

const ModulesMultiSelect = ({ data, field, isEditing, selectedYearId }: MultiSelectProps) => {
    const [open, setOpen] = React.useState(false);
    const selectedModules = data.filter((module) => field.value?.includes(module.id));

    const handleUnselect = (id: number) => {
        field.onChange(field.value.filter((moduleId: number) => moduleId !== id));
    };

    const handleSelect = (id: number) => {
        if (field.value?.includes(id)) {
            handleUnselect(id);
        } else {
            field.onChange([...(field.value || []), id]);
        }
    };

    useEffect(() => {
        field.onChange([]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedYearId]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <FormControl>
                    <Button size="sm" variant="outline" role="combobox" className={cn("justify-between font-normal h-auto min-h-9", !selectedModules.length && "text-muted-foreground")}>
                        {selectedModules.length ? (
                            <div className="flex flex-wrap gap-1 py-2">
                                {selectedModules.map((module) => (
                                    <Badge key={module.id} variant="secondary">
                                        {module.code}
                                        <span
                                            role="button"
                                            tabIndex={0}
                                            className="ml-1 rounded-full outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-ring opacity-70 hover:opacity-100"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleUnselect(module.id);
                                            }}
                                        >
                                            {isEditing && <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />}
                                        </span>
                                    </Badge>
                                ))}
                            </div>
                        ) : (
                            "Assign modules"
                        )}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 -mt-2">
                <Command>
                    <CommandInput placeholder="Search module modules..." />
                    <CommandList>
                        <CommandEmpty>No module found.</CommandEmpty>
                        <CommandGroup>
                            {data.map((module) => (
                                <CommandItem key={module.id} onSelect={() => handleSelect(module.id)} className="cursor-pointer">
                                    {`${module.code} - ${module.name}`}
                                    <Check className={cn("ml-auto", field.value?.includes(module.id) ? "opacity-100" : "opacity-0")} />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

export default ModulesMultiSelect;
