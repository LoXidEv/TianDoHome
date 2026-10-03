<script setup>
const currentYear = new Date().getFullYear()
</script>

<template>
    <div class="dc_home">
        <div class="banner_container" v-reveal="{ animation: 'fadeInUp', delay: 0 }">
            <img src="/img/banner/cat_text.webp" alt="Banner" class="banner_image">
            <div class="banner_text" style="top: 10px; left: 10px;">
                The sun goes to cross the Western sea,
                <br>
                leaving its last salutation to the East.
            </div>
            <div class="banner_text is_mobile" style="top: 240px; right: 10px;">
                I rise, not for the age, but for who I am to be.
            </div>
            <div class="banner_profile">
                <img src="/img/DoNG/DoNG_Avatar.webp" alt="Logo" class="profile_avatar"
                    v-reveal="{ animation: 'zoomIn', delay: 180 }">
                <div class="profile_name" v-reveal="{ animation: 'fadeInUp', delay: 240 }">{{ $t('website.name') }}
                </div>
                <div class="profile_slogan" v-reveal="{ animation: 'fadeInUp', delay: 300 }">{{ $t('website.slogan') }}
                </div>
                <div class="profile_footer" v-reveal="{ animation: 'fadeInUp', delay: 360 }">{{ $t('website.copyright',
                    { year: currentYear }) }}</div>
                <img src="/img/DoNG/DoNG_Home_Bg.webp" alt="Background" class="profile_bg">
            </div>
        </div>
    </div>
</template>

<style scoped>
.banner_text {
    position: absolute;
    font-family: 'Poppins Bold';
    font-size: clamp(12px, 2vw + 8px, 40px);
    line-height: 1.2;
    color: #ffffff;
    z-index: 2;
}

.profile_bg {
    position: absolute;
    bottom: -4px;
    right: -2px;
    width: 280px;
    object-fit: cover;
    z-index: -1;
    opacity: 0.8;
    user-select: none;
}

.profile_name {
    font-family: 'Poppins Bold', 'GenSenRounded-B';
    font-size: clamp(40px, 5vw + 8px, 56px);
    line-height: 1.2;
    margin-top: 10px;
}

.profile_slogan {
    color: #7a7a7a;
    font-size: 15px;
    line-height: 1.6;
}

.profile_footer {
    margin-top: 40px;
    font-size: 12px;
    color: #9a9a9a;
}

.banner_container {
    position: relative;
    background-color: var(--background-color);
    overflow: hidden;
    width: 100%;
    border-radius: var(--border-radius);
    box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
}

.banner_profile {
    position: relative;
    z-index: 2;
    padding: 20px;
    box-sizing: border-box;
    width: 100%;
    min-height: 200px;
    background-color: #ffffff;
}

.profile_avatar {
    position: absolute;
    top: -80px;
    left: 20px;
    border-radius: var(--border-radius);
    width: 100px;
    height: 100px;
    user-select: none;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
}

.banner_image {
    display: block;
    width: 100%;
    height: 300px;
    object-fit: cover;
    user-select: none;
    filter: blur(10px);
}

@media screen and (max-width: 700px) {
    .is_mobile {
        display: none;
    }
}

.dc_home {
    padding: 20px;
}
</style>
