document.addEventListener('DOMContentLoaded', () => {
    const noteTitleInput = document.getElementById('note-title')
    const noteContentInput = document.getElementById('note-content')
    const noteCategoryInput = document.getElementById('note-category')
    const noteForm = document.getElementById('note-form')
    const notesList = document.getElementById('notes-list')
    const searchInput = document.getElementById('search-input')



    // Function to add a new note
    const addNote = (e) => {
        e.preventDefault();
        const title = noteTitleInput.value.trim();
        const content = noteContentInput.value.trim();
        const category = noteCategoryInput.value;

        if (title && content && category) {
            const newNote = {
                id: Date.now(),
                title,
                content,
                category,
                pinned: false,
                favorite: false
            };

            notes.push(newNote);
            localStorage.setItem('notes', JSON.stringify(notes));
            console.log('Note added:', newNote);
            renderNotes();
            noteTitleInput.value = '';
            noteContentInput.value = '';
            noteCategoryInput.value = '';
        } else {
            // HTML attribute validation already set, add event-based validation
            if (!title) {
                noteTitleInput.style.borderColor = 'red';
                noteTitleInput.focus();
            } else if (!content) {
                noteContentInput.style.borderColor = 'red';
                noteContentInput.focus();
            } else if (!category) {
                noteCategoryInput.style.borderColor = 'red';
                noteCategoryInput.focus();
            }
        }
    };

    // Function to delete a note
    const deleteNote = (id) => {
        notes = notes.filter(note => note.id !== id);
        localStorage.setItem('notes', JSON.stringify(notes));
        renderNotes();
    };
})