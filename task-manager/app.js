
(function () {

    let isDragging = false;
    let _cardCounter = 0;
    let _currentCard = null;
    let cardPlaceElement = null;

    function addEvent(eventType, selector, callback) {
        document.addEventListener(eventType, function (e) {
            if (e.target.webkitMatchesSelector(selector)) {
                callback.call(e.target, e);
            }
        }, false);
        
    }

    addEvent('click', '.cardBtn', function () {
        --_cardCounter;
        this.parentNode.remove();
        return false;
    });

    addEvent('dragstart', '.card', function (e) {
        console.log('dragstart');
        isDragging = true;
        e.dataTransfer.setData('text/plain', e.target.dataset.id);
        e.dataTransfer.dropEffect = "copy";
        e.target.classList.add('dragging');
        _currentCard = this;
    });

    addEvent('dragend', '.card', function () {
        console.log('dragend');
        this.classList.remove('dragging');
        cardPlaceElement && cardPlaceElement.remove();
        cardPlaceElement = null;
        isDragging = false;
    });

    addEvent('dragover', '.list, .list .card, .list .card-placeholder', function (e) {
        console.log('dragover');
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        if (this.className === "list") { // List
            this.appendChild(getCardPlaceholder());
        } else if (this.className.indexOf('card') !== -1) { // Card
            this.parentNode.insertBefore(getCardPlaceholder(), this);
        }
    });

    addEvent('drop', '.list, .list .card-placeholder', function (e) {
        console.log('drop');
        e.preventDefault();
        if (!isDragging) return false;
        if (this.className === 'list') {
            this.appendChild(_currentCard);
        } else {
            this.parentNode.replaceChild(_currentCard, this);
        }
    });


    addEvent('submit', '.form-add-todo', function (e) {
        e.preventDefault();
        addTodo(this.todo_text.value, this.todo_text.id);
        this.reset();
        return false;
    });

    function createCard(text, listID) {
        if (!text || text === '') return false;
        let newCardId = ++_cardCounter;
        let card = document.createElement("div");
        let btn = document.createElement("button");

        card.draggable = true;
        card.dataset.id = newCardId;
        card.dataset.listId = listID;
        card.id = 'todo_' + newCardId;
        card.className = 'card';
        card.innerHTML = text.trim();
        card.appendChild(btn);

        btn.innerHTML = "x";
        btn.className = "cardBtn";
        
        return card;
    }

    /*добавление карточек*/
    function addTodo(text, listID, index) {
        listID = listID || 1;
        if (!text) return false;
        let list = document.getElementById('list_' + listID);
        let card = createCard(text, listID, index);
        if (index) {
            list.insertBefore(card, list.children[index]);
        } else {
            list.appendChild(card);
        }
    }

    function getCardPlaceholder() {
        if (!cardPlaceElement) { // Create if not exists
            cardPlaceElement = document.createElement('div');
            cardPlaceElement.className = "card-placeholder";
        }
        return cardPlaceElement;
    }  

})();

   
