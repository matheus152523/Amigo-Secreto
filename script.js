class SecretSantaGame {
    constructor() {
        this.participants = [];
        this.pairs = new Map();
        
        // DOM Elements
        this.form = document.getElementById('participant-form');
        this.input = document.getElementById('participant-name');
        this.participantsList = document.getElementById('participants');
        this.totalParticipants = document.getElementById('total-participants');
        this.nextStepBtn = document.getElementById('next-step');
        this.participantSelect = document.getElementById('participant-select');
        this.revealBtn = document.getElementById('reveal-btn');
        this.resultDiv = document.getElementById('result');
        this.secretFriendText = document.getElementById('secret-friend');
        this.restartBtn = document.getElementById('restart-btn');
        
        // Bind event listeners
        this.form.addEventListener('submit', (e) => this.addParticipant(e));
        this.nextStepBtn.addEventListener('click', () => this.startDraw());
        this.revealBtn.addEventListener('click', () => this.revealSecretFriend());
        this.restartBtn.addEventListener('click', () => this.resetGame());
        this.participantSelect.addEventListener('change', () => {
            this.revealBtn.disabled = !this.participantSelect.value;
        });
    }

    addParticipant(e) {
        e.preventDefault();
        
        const name = this.input.value.trim();
        if (!name) return;
        
        if (this.participants.includes(name)) {
            alert('Este nome já foi adicionado!');
            return;
        }
        
        this.participants.push(name);
        this.updateParticipantsList();
        this.input.value = '';
        this.input.focus();
        
        // Enable next step button if we have at least 3 participants
        this.nextStepBtn.disabled = this.participants.length < 3;
    }

    updateParticipantsList() {
        this.participantsList.innerHTML = '';
        this.totalParticipants.textContent = this.participants.length;
        
        this.participants.forEach(name => {
            const li = document.createElement('li');
            li.innerHTML = `
                ${name}
                <button class="remove-btn" onclick="game.removeParticipant('${name}')">×</button>
            `;
            this.participantsList.appendChild(li);
        });
    }

    removeParticipant(name) {
        this.participants = this.participants.filter(p => p !== name);
        this.updateParticipantsList();
        this.nextStepBtn.disabled = this.participants.length < 3;
    }

    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    startDraw() {
        // Create pairs
        let receivers = [...this.participants];
        let givers = [...this.participants];
        
        // Shuffle receivers
        receivers = this.shuffle(receivers);
        
        // Ensure no one gets themselves
        while (givers.some((giver, i) => giver === receivers[i])) {
            receivers = this.shuffle(receivers);
        }
        
        // Create pairs map
        this.pairs.clear();
        givers.forEach((giver, i) => {
            this.pairs.set(giver, receivers[i]);
        });
        
        // Update UI for step 2
        this.updateSelectOptions();
        document.getElementById('step1').classList.remove('active');
        document.getElementById('step2').classList.add('active');
    }

    updateSelectOptions() {
        this.participantSelect.innerHTML = '<option value="">Selecione seu nome</option>';
        this.participants.forEach(name => {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            this.participantSelect.appendChild(option);
        });
    }

    revealSecretFriend() {
        const participant = this.participantSelect.value;
        const secretFriend = this.pairs.get(participant);
        
        this.resultDiv.classList.remove('hidden');
        this.secretFriendText.textContent = secretFriend;
        
        // Disable the current participant option
        const option = this.participantSelect.querySelector(`option[value="${participant}"]`);
        option.disabled = true;
        
        // Reset selection and disable reveal button
        this.participantSelect.value = '';
        this.revealBtn.disabled = true;
    }

    resetGame() {
        // Reset data
        this.participants = [];
        this.pairs.clear();
        
        // Reset UI
        this.updateParticipantsList();
        this.nextStepBtn.disabled = true;
        this.input.value = '';
        this.resultDiv.classList.add('hidden');
        
        // Switch back to step 1
        document.getElementById('step2').classList.remove('active');
        document.getElementById('step1').classList.add('active');
    }
}

// Initialize the game when the page loads
let game;
window.addEventListener('DOMContentLoaded', () => {
    game = new SecretSantaGame();
});