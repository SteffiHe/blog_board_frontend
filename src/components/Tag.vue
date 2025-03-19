<script setup>
    defineProps({
        tagValue: {
            type: String,
            required: true
        }
    });

    function getBadgeColor(tag) {
        switch (tag) {
            case 'Relational DB':
                return 'text-bg-primary';
            case 'Document DB':
                return 'text-bg-secondary';
            case 'Time-Series DB':
                return 'text-bg-info';
            case 'Object Storage':
                return 'text-bg-primary';
            case 'Key-Value Store':
                return 'text-bg-secondary';
            case 'High Concurrency':
                return 'text-bg-danger';
            case 'Replication Set':
                return 'text-bg-warning';
            default:
                return 'text-bg-light';
        }
    }

</script>

<template>
    <div :class="['badge me-2', getBadgeColor(tagValue)]">
        {{ tagValue }}
    </div>
</template>