const COGNITIVE_CONCEPTS = [
    ['Visual perception', 'Readable labels and clearly visible buttons help users recognize interface elements.'],
    ['Proximity', 'Related input labels and fields are grouped together so their relationship is clear.'],
    ['Similarity', 'Buttons and form controls use consistent styling to communicate similar functions.'],
    ['Continuity', 'The interface follows a logical sequence: register or log in, then access the dashboard.'],
    ['Selective attention', 'Feedback messages are presented prominently so users can notice important results.'],
    ['Haptic feedback', 'A short device vibration confirms successful registration when the device supports it.'],
    ['Auditory perception', 'A short sound provides an additional cue of certainty, may it be for a working button, incorrect password, or successful registration.'],
];

let carouselIndex = 0;
let swipeStartX = null;

function createConceptCard(concept) {
    const card = document.createElement('article');
    const title = document.createElement('h3');
    const description = document.createElement('p');

    card.className = 'concept-card';
    description.className = 'concept-body';
    title.textContent = concept[0];
    description.textContent = concept[1];

    card.appendChild(title);
    card.appendChild(description);
    return card;
}

// Distance from one card to the next, including the gap. It is 0 while the dashboard is hidden.
function getCarouselStep() {
    const cards = getEl('carousel-track').children;
    return cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : 0;
}

function getVisibleCardCount() {
    const step = getCarouselStep();
    return step ? Math.max(1, Math.round(getEl('carousel-view').clientWidth / step)) : 1;
}

function getCarouselMaxIndex() {
    return Math.max(0, COGNITIVE_CONCEPTS.length - getVisibleCardCount());
}

function updateArrowStates() {
    getEl('carousel-prev').disabled = carouselIndex <= 0;
    getEl('carousel-next').disabled = carouselIndex >= getCarouselMaxIndex();
}

function moveCarouselTo(index, withSound) {
    const clampedIndex = Math.min(Math.max(index, 0), getCarouselMaxIndex());
    if (withSound && clampedIndex !== carouselIndex) playCarouselSound();

    carouselIndex = clampedIndex;
    getEl('carousel-track').style.transform = 'translateX(-' + (clampedIndex * getCarouselStep()) + 'px)';
    updateArrowStates();
}

function showNextConcept() {
    moveCarouselTo(carouselIndex + 1, true);
}

function showPreviousConcept() {
    moveCarouselTo(carouselIndex - 1, true);
}

// Call after the dashboard is shown or the window is resized, when card sizes are known.
function refreshCarousel() {
    moveCarouselTo(carouselIndex, false);
}

function addCognitiveConcepts() {
    const track = getEl('carousel-track');
    if (track.children.length > 0) return;

    COGNITIVE_CONCEPTS.forEach(function (concept) {
        track.appendChild(createConceptCard(concept));
    });
}

function finishSwipe(event) {
    if (swipeStartX === null) return;

    const distance = event.clientX - swipeStartX;
    swipeStartX = null;

    if (Math.abs(distance) < SWIPE_MIN_PX) return;
    if (distance < 0) showNextConcept();
    else showPreviousConcept();
}

function listenForSwipe() {
    const view = getEl('carousel-view');
    view.addEventListener('pointerdown', function (event) { swipeStartX = event.clientX; });
    view.addEventListener('pointerup', finishSwipe);
    view.addEventListener('pointercancel', function () { swipeStartX = null; });
}

function listenForCarouselKeys() {
    document.addEventListener('keydown', function (event) {
        if (!isScreenShown('dashboard') || isModalOpen()) return;
        if (event.key === 'ArrowRight') showNextConcept();
        if (event.key === 'ArrowLeft') showPreviousConcept();
    });
    window.addEventListener('resize', refreshCarousel);
}
