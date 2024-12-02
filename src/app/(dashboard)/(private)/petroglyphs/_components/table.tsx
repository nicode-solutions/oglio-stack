import { Tables } from "@/types/supabase"

interface TableProps {
    petroglyphs: Tables<"petroglyphs">[]
}

export const Table = ({ petroglyphs }: TableProps) => {
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
                            <td>{petroglyph.created_at}</td>
                            <td>{petroglyph.engraving}</td>
                        </tr>
                    ))}

                </tbody>
            </table>
        </div>
    )
}