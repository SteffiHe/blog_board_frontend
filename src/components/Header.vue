<script setup>

///////////////////////////////////////////////
// IDs to be used for the respective DOM elements in the template
///////////////////////////////////////////////

const BUTTON_TOGGLE_MODAL_ID = 'buttonToggleModal' // for the button that opens the modal

///////////////////////////////////////////////
// implementation
///////////////////////////////////////////////

defineProps({
    title: {
        type: String,
        required: true
    }
});

const emit = defineEmits(["show-modal"]);

</script>

<template>
    <nav class="navbar bg-light">
        <div class="container-fluid">
            <!-- Logo and title of the Kanban board -->
            <span class="navbar-brand mb-0 h1">
                <img src="../assets/logo.svg" alt="Logo" width="24" height="24" class="d-inline-block align-text-top">
                {{ title }}
            </span>

            <!-- Button to toggle the modal for task creation -->

            <button :id="BUTTON_TOGGLE_MODAL_ID" class="d-flex btn btn-outline-primary" @click="$emit('show-modal')">Create new article</button>
        </div>
    </nav>
</template>