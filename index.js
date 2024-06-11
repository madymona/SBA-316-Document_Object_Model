//Waits for the DOM to be fully loaded before running the script 
document.addEventListener('DOMContentLoaded', () => {
    //Caching Elements
    const noteTitleInput = document.querySelector('#note-title')
    const noteContentInput = document.querySelector('#note-content')
    const noteCategoryInput = document.querySelector('#note-category')
    const noteForm = document.getElementById('note-form')
    const notesList = document.getElementById('notes-list')
    const searchInput = document.getElementById('search-input')
    const noteTemplate = document.getElementById('note-template')

    // Loads notes from localStorage or initializes an empty array if no notes are found
    let notes = JSON.parse(localStorage.getItem('notes')) || []

    // Function to render notes based on a search filter
    const renderNotes = (filter = '') => {
        // Clears the current list of notes
        notesList.innerHTML = ''
        //Create a document fragment to minimize reflows and repaints
        const fragment = document.createDocumentFragment()
        // Filter notes based on the search filter
        notes
        .filter(note => note.title.includes(filter) || note.content.includes(filter) || note.category.includes(filter))
        .forEach(note => {
            // Clone the note template
            const noteElement = noteTemplate.content.cloneNode(true) //Creates a deep copy of the template content (note-template")

            // Clones the note template and fills it with the note's data (title, content, category).
            noteElement.querySelector('.note-title').textContent = note.title
            noteElement.querySelector('.note-content').textContent = note.content
            noteElement.querySelector('.note-category').textContent = `Category: ${note.category}`

            const deleteButton = noteElement.querySelector('.delete')
            const pinButton = noteElement.querySelector('.pin')
            const favoriteButton = noteElement.querySelector('.favorite')

            // Set button text and event listeners
            deleteButton.addEventListener('click', () => deleteNote(note.id))

            pinButton.textContent = note.pinned ? 'Unpin' : 'Pin'
            pinButton.addEventListener('click', () => {
                pinUnpin(note.id)
                pinButton.textContent = note.pinned ? 'Pin' : 'Unpin'
            })

            favoriteButton.textContent = note.favorite ? 'Unfavorite' : 'Favorite'
            favoriteButton.addEventListener('click', () => {
                favoriteUnfavorite(note.id)
                favoriteButton.textContent = note.favorite ? 'Favorite' : 'Unfavorite'
            })

            // Append the note to the DocumentFragment
            fragment.appendChild(noteElement)
        })

     //and the DocumentFragment  to the list
     notesList.appendChild(fragment)    
    }

    // Function to add a new note
    const addNote = (e) => {
        //Prevents the default form submission behavior
        e.preventDefault()
         // Retrieves and trims the input values
        const title = noteTitleInput.value.trim()
        const content = noteContentInput.value.trim()
        const category = noteCategoryInput.value

        if (title && content && category) {
            // Create a new note object
            const newNote = {
                id: Date.now(),
                title,
                content,
                category,
                pinned: false,
                favorite: false
            }

           //  adds newNote  to the notes array and localStorage
            notes.push(newNote)
            localStorage.setItem('notes', JSON.stringify(notes))
            console.log('Note added:', newNote)

            // Clears the input fields and re-renders the notes
            renderNotes()
            noteTitleInput.value = ''
            noteContentInput.value = ''
            noteCategoryInput.value = ''
        } else {
            // updates the border color for invalid fields
            if (!title) {
                noteTitleInput.style.borderColor = 'red'
                noteTitleInput.focus()
            } else if (!content) {
                noteContentInput.style.borderColor = 'red'
                noteContentInput.focus()
            } else if (!category) {
                noteCategoryInput.style.borderColor = 'red'
                noteCategoryInput.focus()
            }
        }
    }

    // Function to delete a note
    const deleteNote = (id) => {
        // Filters out the note with the specified ID from the notes array
        notes = notes.filter(note => note.id !== id)

        // Update localStorage and render the notes
        localStorage.setItem('notes', JSON.stringify(notes))
        renderNotes()
    }

    // Function to pin/unpin a note
    const pinUnpin = (id) => {
        // Map over the notes array and toggle the pinned property of the note with the given id
        notes = notes.map(note => {
            if (note.id === id) {
                note.pinned = !note.pinned
            }
            return note
        })

        // Update localStorage and render the notes
        localStorage.setItem('notes', JSON.stringify(notes))
        renderNotes()
    }

    // Function to favorite/unfavorite a note
    const favoriteUnfavorite = (id) => {
        // Map over the notes array and toggle the favorite property of the note with the given id
        notes = notes.map(note => {
            if (note.id === id) {
                note.favorite = !note.favorite
            }
            return note
        })

        // Update localStorage and render the notes
        localStorage.setItem('notes', JSON.stringify(notes))
        renderNotes()
    }

    // Function to clear all notes
    const clearAllNotes = () => {
        notes = []
        localStorage.removeItem('notes')
        renderNotes()
    }

    // Event listener for form submission
    noteForm.addEventListener('submit', addNote)

    // Event listener for search input
    searchInput.addEventListener('input', () => renderNotes(searchInput.value))

    window.addEventListener('beforeunload', (event) => {
    // Shows a confirmation message when the user tries to leave the page. If confirmed, all notes are cleared
    const confirmationMessage = 'Are you sure you want to leave? All notes will be cleared.'
        event.preventDefault() 
        dialog.returnValue = confirmationMessage // set the confirmation message
    })

    // Clears all notes if the user confirms leaving the page
    window.addEventListener('unload', clearAllNotes)

})
