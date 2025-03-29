<script setup>
    defineProps({
        rate: {
            type: String,
            required: true
        }
    });

    function getStarCount(rate) {
        switch (rate) {
            case 'High':
                return 3;
            case 'Medium':
                return 2;
            case 'Low':
                return 1;
            default:
                return 0;
        }
    }

</script>

<template>
    <div class="badge me-2 text-bg-success">
        <div v-if="rate">
            Rate 
            <span v-for="n in getStarCount(rate)" :key="n">
                <i class="bi bi-star-fill" style="color: gold;"></i>
            </span>
        </div> 
    </div>
    
</template>