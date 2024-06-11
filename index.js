//Waits for the DOM to be fully loaded before running the script 
document.addEventListener('DOMContentLoaded', () => {
    //Caching Elements
    const noteTitleInput = document.querySelector('#note-title')
    const noteContentInput = document.querySelector('#note-content')
    const noteCategoryInput = document.querySelector('#note-category')
    const noteForm = document.getElementById('note-form')
    const notesList = document.getElementById('notes-list')
    const searchInput = document.getElementById('search-input')

    // Loads notes from localStorage or initializes an empty array if no notes are found
    let notes = JSON.parse(localStorage.getItem('notes')) || []

   
    const renderNotes = (filter = '') => {
        // Clears the current list of notes
        notesList.innerHTML = ''

        // Filter notes based on the search filter
        notes
            .filter(note => note.title.includes(filter) || note.content.includes(filter) || note.category.includes(filter))
            .forEach(note => {
                //Creates and appends HTML elements for each note, title, content, category, and  delete, pin, favorite  buttons
                const noteElement = document.createElement('div')
                noteElement.classList.add('note')

                const noteTitle = document.createElement('h2')
                noteTitle.textContent = note.title

                const noteContent = document.createElement('p')
                noteContent.textContent = note.content

                const noteCategory = document.createElement('div')
                noteCategory.classList.add('category')
                noteCategory.textContent = `Category: ${note.category}`

                
                const deleteButton = document.createElement('button')
                deleteButton.classList.add('delete')
                deleteButton.textContent = 'Delete'
                deleteButton.addEventListener('click', () => deleteNote(note.id))

                const pinButton = document.createElement('button')
                pinButton.classList.add('pin')
                pinButton.textContent = note.pinned ? 'Unpin' : 'Pin'
                pinButton.addEventListener('click', () => {
                    pinUnpin(note.id)
                    pinButton.textContent = note.pinned ? 'Pin' : 'Unpin'
                })

                const favoriteButton = document.createElement('button')
                favoriteButton.classList.add('favorite')
                favoriteButton.textContent = note.favorite ? 'Unfavorite' : 'Favorite'
                favoriteButton.addEventListener('click', () => {
                    favoriteUnfavorite(note.id)
                    favoriteButton.textContent = note.favorite ? 'Favorite' : 'Unfavorite'
                })

                // Create a document fragment to append elements
                const fragment = document.createDocumentFragment()
                fragment.appendChild(noteTitle)
                fragment.appendChild(noteContent)
                fragment.appendChild(noteCategory)
                fragment.appendChild(deleteButton)
                fragment.appendChild(pinButton)
                fragment.appendChild(favoriteButton)

                // Append the fragment to the note element and the note element to the note list
                noteElement.appendChild(fragment)
                notesList.appendChild(noteElement)
            })
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
    const confirmationMessage = 'Are you sure you want to leave? All notes will be cleared.';
        event.preventDefault(); // Some browsers may require this to trigger the dialog
        dialog.returnValue = confirmationMessage; // Standard way to set the confirmation message
    });

    // Clears all notes if the user confirms leaving the page
    window.addEventListener('unload', clearAllNotes)

})
