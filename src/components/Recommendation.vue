<script setup>
    defineProps({
        recommendation: {
            type: String,
            required: true
        }
    });

    function getRecommendationCount(recommendation) {
        switch (recommendation) {
            case 'Highly Rec.':
                return 3;
            case 'Moderately Rec.':
                return 2;
            case 'Partially Rec.':
                return 1;
            default:
                return 0;
        }
    }

</script>

<template>
    <div class="badge me-2 text-bg-dark">
        <div v-if="recommendation">
            Recommendation 
            <span v-for="n in getRecommendationCount(recommendation)" :key="n">
                <i class="bi bi-fire" style="color: red;"></i>
            </span>
        </div> 
    </div>
    
</template>