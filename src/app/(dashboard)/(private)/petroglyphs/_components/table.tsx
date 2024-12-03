import { Tables } from "@/types/supabase"

interface TableProps {
    petroglyphs: Tables<"petroglyphs">[]
}

export const Table = ({ petroglyphs }: TableProps) => {
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
        <div className="overflow-x-auto">
            <table className="table">
                {/* head */}
                <thead>
                    <tr>
                        <th></th>
                        <th>Date</th>
                        <th>Engraving</th>
                    </tr>
                </thead>
                <tbody>
                    {petroglyphs.map((petroglyph, index) => (
                        <tr key={index}>
                            <th>{index + 1}</th>
                            <td>{formatTimestamp(petroglyph.created_at)}</td>
                            <td>{petroglyph.engraving}</td>
                        </tr>
                    ))}

                </tbody>
            </table>
        </div>
    )
}