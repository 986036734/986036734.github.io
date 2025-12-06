document.addEventListener('DOMContentLoaded', () => {
    const wordListContainer = document.getElementById('word-list');
    const modal = document.getElementById('modal');
    const closeButton = document.querySelector('.close-button');
    const toggleChineseBtn = document.getElementById('toggle-chinese-btn');

    let audioPlayer = new Audio();

    // 1. 实现中文切换功能
    toggleChineseBtn.addEventListener('click', () => {
        document.body.classList.toggle('hide-chinese');
        if (document.body.classList.contains('hide-chinese')) {
            toggleChineseBtn.textContent = '显示中文';
        } else {
            toggleChineseBtn.textContent = '隐藏中文';
        }
    });

    // 2. 加载单词数据
    fetch('words.json')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            wordListContainer.innerHTML = ''; // 清空以防万一
            data.forEach(wordData => {
                const card = document.createElement('div');
                card.className = 'word-card';
                
                // 3. 在卡片中加入英文和中文
                card.innerHTML = `
                    <div class="word-english">${wordData.word}</div>
                    <div class="word-chinese">${wordData.definition}</div>
                `;
                
                card.addEventListener('click', () => showWordDetails(wordData));
                wordListContainer.appendChild(card);
            });
        })
        .catch(error => {
            wordListContainer.innerHTML = '<p style="color: red;">无法加载单词数据。请检查 words.json 文件是否存在且格式正确。</p>';
            console.error('Fetch error:', error);
        });

    // --- 弹窗相关的功能 (保持不变) ---
    function showWordDetails(wordData) {
        document.getElementById('modal-word').textContent = wordData.word;
        document.getElementById('modal-definition').textContent = `释义: ${wordData.definition}`;
        document.getElementById('modal-pronunciation-uk').textContent = wordData.pronunciations.uk.ipa;
        document.getElementById('modal-pronunciation-us').textContent = wordData.pronunciations.us.ipa;

        const examplesContainer = document.getElementById('modal-examples');
        examplesContainer.innerHTML = ''; 
        if (wordData.examples && wordData.examples.length > 0) {
            wordData.examples.forEach(ex => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'example-item';
                itemDiv.innerHTML = `<p class="example-en">${ex.en}</p><p class="example-cn">${ex.cn}</p>`;
                examplesContainer.appendChild(itemDiv);
            });
        }

        const playUkAudioBtn = document.getElementById('play-uk-audio');
        const playUsAudioBtn = document.getElementById('play-us-audio');
        const newPlayUkBtn = playUkAudioBtn.cloneNode(true);
        playUkAudioBtn.parentNode.replaceChild(newPlayUkBtn, playUkAudioBtn);
        newPlayUkBtn.onclick = () => playAudio(wordData.pronunciations.uk.audio);
        
        const newPlayUsBtn = playUsAudioBtn.cloneNode(true);
        playUsAudioBtn.parentNode.replaceChild(newPlayUsBtn, playUsAudioBtn);
        newPlayUsBtn.onclick = () => playAudio(wordData.pronunciations.us.audio);
        
        modal.style.display = 'flex';
    }

    function playAudio(audioSrc) {
        audioPlayer.src = audioSrc;
        audioPlayer.play();
    }

    closeButton.addEventListener('click', () => { modal.style.display = 'none'; });
    window.addEventListener('click', (event) => { if (event.target == modal) { modal.style.display = 'none'; } });
});
