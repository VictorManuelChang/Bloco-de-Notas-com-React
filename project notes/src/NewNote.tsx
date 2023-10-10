import { NoteData, Tag } from "./App";
import { NoteForm } from "./NoteForm";

type NewNoteProps = {
    onSubmit: (data: NoteData) => void
    onAddTag: (tag: Tag) => void
    availableTags: Tag[]
}

export function NewNote ({ onSubmit, onAddTag, availableTags}: NewNoteProps) {
    return <>
        <h1 className="mb-4">New Note</h1> {/*mb-4 é margin bottom, para dar um espaço embaixo */}
        <NoteForm onSubmit={onSubmit} onAddTag={onAddTag} availableTags = {availableTags} /> {/*Para tornar padrão as interfaces que são utilizadas nas Notas */}
    </>
}