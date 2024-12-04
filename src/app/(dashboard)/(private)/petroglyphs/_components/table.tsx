import { Tables } from "@/types/supabase"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface TableProps {
    petroglyphs: Tables<"petroglyphs">[]
}

const PetroglyphsTable = ({ petroglyphs }: TableProps) => {
    const formatTimestamp = (timestamp: string): string => {
        const date = new Date(timestamp);
        const day = String(date.getUTCDate()).padStart(2, "0");
        const month = String(date.getUTCMonth() + 1).padStart(2, "0");
        const year = date.getUTCFullYear();
        const hours = String(date.getUTCHours()).padStart(2, "0");
        const minutes = String(date.getUTCMinutes()).padStart(2, "0");
        const seconds = String(date.getUTCSeconds()).padStart(2, "0");

        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    };

    return (
        <Card className="w-full">

            <CardHeader>
                <CardTitle>Petroglyphs</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">No.</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Engraving</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {petroglyphs.map((petroglyph, index) => (
                                <TableRow key={petroglyph.id}>
                                    <TableCell className="font-medium">{index + 1}</TableCell>
                                    <TableCell>{formatTimestamp(petroglyph.created_at)}</TableCell>
                                    <TableCell>{petroglyph.engraving}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>

    )
}

export default PetroglyphsTable