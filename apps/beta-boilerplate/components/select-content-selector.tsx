import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Selector } from "@/lib/definitions";

export function SelectContentSelector({ selector }: { selector: Selector[] }) {

    function onValueChange(value: string) {
        console.log('Selected value:', value);
    }

    return (
        <Select onValueChange={onValueChange}>
            <SelectTrigger className="w-28 border-0 focus:ring-0 focus:ring-offset-0">
                <SelectValue placeholder={selector[0].label} />
            </SelectTrigger>
            <SelectContent>
                {selector.map((item, index) => (
                    <SelectItem key={index} value={item.value}>{item.label}</SelectItem>
                ))}
            </SelectContent>
        </Select>)
}