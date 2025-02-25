"use client";

import * as React from "react";
import { X, ChevronsUpDown, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Command, CommandGroup, CommandItem, CommandList, CommandInput, CommandEmpty } from "@/components/ui/command";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { FormControl } from "@/components/ui/form";
import { cn } from "@/lib/utils";

export type ModuleTutor = {
    id: number;
    name: string;
};

interface MultiSelectProps {
    data: ModuleTutor[];
    field: {
        value: number[];
        onChange: (value: number[]) => void;
    };
    isEditing: boolean;
}

const MultiSelect = ({ data, field, isEditing }: MultiSelectProps) => {
    const [open, setOpen] = React.useState(false);
    const selectedTutors = data.filter((tutor) => field.value?.includes(tutor.id));

    const handleUnselect = (id: number) => {
        field.onChange(field.value.filter((tutorId: number) => tutorId !== id));
    };

    const handleSelect = (id: number) => {
        if (field.value?.includes(id)) {
            handleUnselect(id);
        } else {
            field.onChange([...(field.value || []), id]);
        }
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <FormControl>
                    <Button size="sm" variant="outline" role="combobox" className={cn("justify-between font-normal h-auto min-h-9", !selectedTutors.length && "text-muted-foreground")} disabled={!isEditing}>
                        {selectedTutors.length ? (
                            <div className="flex flex-wrap gap-1 py-2">
                                {selectedTutors.map((tutor) => (
                                    <Badge key={tutor.id} variant="secondary">
                                        {tutor.name}
                                        <span
                                            role="button"
                                            tabIndex={0}
                                            className="ml-1 rounded-full outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-ring opacity-70 hover:opacity-100"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleUnselect(tutor.id);
                                            }}
                                        >
                                            <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                        </span>
                                    </Badge>
                                ))}
                            </div>
                        ) : (
                            "Assign module tutors"
                        )}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 -mt-2">
                <Command>
                    <CommandInput placeholder="Search module tutors..." />
                    <CommandList>
                        <CommandEmpty>No module tutors found.</CommandEmpty>
                        <CommandGroup>
                            {data.map((tutor) => (
                                <CommandItem key={tutor.id} onSelect={() => handleSelect(tutor.id)} className="cursor-pointer">
                                    {tutor.name}
                                    <Check className={cn("ml-auto", field.value?.includes(tutor.id) ? "opacity-100" : "opacity-0")} />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

export default MultiSelect;
