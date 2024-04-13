import type { Action } from 'svelte/action'

export const draggable: Action<HTMLElement, {
    dragStart: () => void,
    dragEnd: () => void,
}> = (node, data) => {
    // Save data
    let state = data;

    // Make the HTML element draggable
    node.draggable = true;

    // Change cursor to grab
    node.classList.add('cursor-grab')

    // Drag-Start Event
    function dragStart(/*e: DragEvent*/) {
        // Set drag event data
        // e.dataTransfer!.setData('text/plain', JSON.stringify(state))

        // Styling
        node.classList.remove('cursor-grab')
        node.classList.add('cursor-grabbing')

        // Execute callback
        state.dragStart()
    }

    // Drag-End Event
    function dragEnd() {
        // Styling
        node.classList.remove('cursor-grabbing')
        node.classList.add('cursor-grab')

        // Execute callback
        state.dragEnd()
    }

    // Set event listeners
    node.addEventListener('dragstart', dragStart)
    node.addEventListener('dragend', dragEnd)

    // Return
    return {
        // Update internal data 'state' when outside data of the element change
        update(data) { state = data },

        // Clean up event listeners
        destroy() {
            node.removeEventListener('dragstart', dragStart)
            node.removeEventListener('dragend', dragEnd)
        }
    }
}

export const dropzone: Action<HTMLElement, {
    x: number,
    onDragOver: () => void,
    onDrag: () => void
}> = (node, options) => {

    // Drag-Enter event
    function dragEnter(/*e: DragEvent*/) {
        // Styling
        node.classList.add('border-2')
    }

    // Drag-Leave event
    function dragLeave(/*e: DragEvent*/) {
        // Styling
        node.classList.remove('border-2')
    }

    // Drag-Over
    function dragOver(e: DragEvent) {
        e.preventDefault()
        e.dataTransfer!.dropEffect = 'move'

        // Get data from event
        // const data = e.dataTransfer?.getData('text/plain')

        // Call on drag over
        options.onDragOver()
    }

    // Handle Drop event
    function handleDrop(e: DragEvent) {
        // Prevent default and remove class
        e.preventDefault()
        node.classList.remove('border-2')

        // Get data from event
        // const data = e.dataTransfer?.getData('text/plain')

        // Call on drag
        options.onDrag()
    }

    // Set event listeners
    node.addEventListener('dragenter', dragEnter)
    node.addEventListener('dragleave', dragLeave)
    node.addEventListener('dragover', dragOver)
    node.addEventListener('drop', handleDrop)

    // Return
    return {
        destroy() {
            node.removeEventListener('dragenter', dragEnter)
            node.removeEventListener('dragleave', dragLeave)
            node.removeEventListener('dragover', dragOver)
            node.removeEventListener('drop', handleDrop)
        }
    }
}
