document.addEventListener('DOMContentLoaded', () => {
    const wordListContainer = document.getElementById('word-list');
    const modal = document.getElementById('modal');
    const closeButton = document.querySelector('.close-button');

    let audioPlayer = new Audio();

    const playUkAudioBtn = document.getElementById('play-uk-audio');
    const playUsAudioBtn = document.getElementById('play-us-audio');

    fetch('words.json')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            data.forEach(wordData => {
                const card = document.createElement('div');
                card.className = 'word-card';
                card.textContent = wordData.word;
                card.addEventListener('click', () => showWordDetails(wordData));
                wordListContainer.appendChild(card);
            });
        })
        .catch(error => {
            wordListContainer.innerHTML = '<p style="color: red;">无法加载单词数据。请确保 words.json 文件存在且格式正确。</p>';
            console.error('Fetch error:', error);
        });

    function showWordDetails(wordData) {
        // --- 填充基本信息 ---
        document.getElementById('modal-word').textContent = wordData.word;
        document.getElementById('modal-definition').textContent = `释义: ${wordData.definition}`;
        document.getElementById('modal-pronunciation-uk').textContent = wordData.pronunciations.uk.ipa;
        document.getElementById('modal-pronunciation-us').textContent = wordData.pronunciations.us.ipa;

        // --- 动态生成例句 ---
        const examplesContainer = document.getElementById('modal-examples');
        examplesContainer.innerHTML = ''; // 清空上一个单词的例句
        if (wordData.examples && wordData.examples.length > 0) {
            wordData.examples.forEach(ex => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'example-item';

                const pEn = document.createElement('p');
                pEn.className = 'example-en';
                pEn.textContent = ex.en;

                const pCn = document.createElement('p');
                pCn.className = 'example-cn';
                pCn.textContent = ex.cn;
                
                itemDiv.appendChild(pEn);
                itemDiv.appendChild(pCn);
                examplesContainer.appendChild(itemDiv);
            });
        }

        // --- 绑定音频播放事件 ---
        // 使用克隆节点的方式来移除旧的事件监听器
        const newPlayUkBtn = playUkAudioBtn.cloneNode(true);
        playUkAudioBtn.parentNode.replaceChild(newPlayUkBtn, playUkAudioBtn);
        newPlayUkBtn.onclick = () => playAudio(wordData.pronunciations.uk.audio);
        
        const newPlayUsBtn = playUsAudioBtn.cloneNode(true);
        playUsAudioBtn.parentNode.replaceChild(newPlayUsBtn, playUsAudioBtn);
        newPlayUsBtn.onclick = () => playAudio(wordData.pronunciations.us.audio);
        
        // --- 显示弹窗 ---
        modal.style.display = 'flex';
    }

    function playAudio(audioSrc) {
        audioPlayer.src = audioSrc;
        audioPlayer.play();
    }

    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });
});
