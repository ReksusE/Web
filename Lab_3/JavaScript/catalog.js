const catalogData = [
    { id: 1, 
        title: 'Podcast Launch Pro', 
        description: 'Полный курс по запуску успешного подкаста с нуля.', 
        price: 120, 
        rating: 4.9, 
        category: 'Audio', 
        imageUrl: './Image/Catalog/catalog__img__1.jpg' 
    },
    { id: 2, 
        title: 'Video Editing Basics', 
        description: 'Основы видеомонтажа для начинающих в Premiere Pro.', 
        price: 80, 
        rating: 4.5, 
        category: 'Video', 
        imageUrl: './Image/Catalog/catalog__img__2.jpg' 
    },
    { id: 3, 
        title: 'Advanced Audio Mixing', 
        description: 'Сведение звука и мастеринг для профессионалов.', 
        price: 150, 
        rating: 4.8, 
        category: 'Audio', 
        imageUrl: './Image/Catalog/catalog__img__3.jpg' 
    },
    { id: 4, 
        title: 'Figma for Web Design', 
        description: 'Создание современных интерфейсов и лендингов.', 
        price: 99, 
        rating: 4.7, 
        category: 'Design', 
        imageUrl: './Image/Catalog/catalog__img__4.jpg' 
    },
    { id: 5, 
        title: 'YouTube Growth', 
        description: 'Маркетинг и алгоритмы: как набрать первый миллион просмотров.', 
        price: 199, 
        rating: 5.0, 
        category: 'Marketing', 
        imageUrl: './Image/Catalog/catalog__img__5.jpg' 
    },
    { id: 6, 
        title: 'After Effects Magic', 
        description: 'Создание крутых анимаций и визуальных эффектов.', 
        price: 140, 
        rating: 4.6, 
        category: 'Video', 
        imageUrl: './Image/Catalog/catalog__img__6.jpg' 
    },
    { id: 7, 
        title: 'Voice Acting Masterclass', 
        description: 'Искусство озвучки и постановки голоса.', 
        price: 70, 
        rating: 4.3, 
        category: 'Audio', 
        imageUrl: './Image/Catalog/catalog__img__7.jpg' 
    },
    { id: 8, 
        title: 'Photoshop Retouching', 
        description: 'Профессиональная ретушь и цветокоррекция фотографий.', 
        price: 85, 
        rating: 4.4, 
        category: 'Design', 
        imageUrl: './Image/Catalog/catalog__img__8.jpg' 
    },
    { id: 9, 
        title: 'Social Media Advertising', 
        description: 'Настройка таргетированной рекламы с высоким ROI.', 
        price: 160, 
        rating: 4.8, 
        category: 'Marketing', 
        imageUrl: './Image/Catalog/catalog__img__9.jpg' 
    },
    { id: 10, 
        title: 'Color Grading Pro', 
        description: 'Цветокоррекция видео в DaVinci Resolve.', 
        price: 110, 
        rating: 4.9, 
        category: 'Video', 
        imageUrl: './Image/Catalog/catalog__img__10.jpg' 
    },
    { id: 11, 
        title: 'Logo Design Principles', 
        description: 'Теория и практика создания коммерческих логотипов.', 
        price: 65, 
        rating: 4.2, 
        category: 'Design', 
        imageUrl: './Image/Catalog/catalog__img__11.jpg' 
    },
    { id: 12, 
        title: 'SEO Fundamentals', 
        description: 'Продвижение сайтов в топ поисковых систем.', 
        price: 90, 
        rating: 4.5, 
        category: 'Marketing', 
        imageUrl: './Image/Catalog/catalog__img__12.jpg' 
    },
    { id: 13, 
        title: 'Sound Design Lab', 
        description: 'Создание уникальных звуковых эффектов для кино и игр.', 
        price: 130, 
        rating: 4.7, 
        category: 'Audio', 
        imageUrl: './Image/Catalog/catalog__img__13.jpg' 
    },
    { id: 14, 
        title: 'Typography in Web', 
        description: 'Искусство шрифтов на веб-страницах.', 
        price: 50, 
        rating: 4.1, 
        category: 'Design', 
        imageUrl: './Image/Catalog/catalog__img__14.jpg' 
    },
    { id: 15, 
        title: 'Content Strategy', 
        description: 'Создание контент-плана, который продает.', 
        price: 105, 
        rating: 4.6, 
        category: 'Marketing', 
        imageUrl: './Image/Catalog/catalog__img__15.jpg' 
    }
];

const container = document.getElementById('catalog-container');

function renderCards(dataArray) {
    container.innerHTML = '';

    if (dataArray.length === 0) {
        container.innerHTML = `<div class="empty--state">К сожалению, по вашим критериям товары не найдены. 😥<br>Попробуйте изменить параметры поиска.</div>`;
        return;
    }

    dataArray.forEach(item => {
        const card = document.createElement('div');
        card.className = 'course--card';
        card.innerHTML = `
            <img src="${item.imageUrl}" alt="${item.title}" loading="lazy">
            <div class="course--card--content">
                <span class="category--badge">${item.category}</span>
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                <div class="course--card--meta">
                    <span class="price">$${item.price}</span>
                    <span class="rating">★ ${item.rating}</span>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

renderCards(catalogData)

//1
document.getElementById('btnMap').addEventListener('click', () => {
    const discounted = catalogData.map(item => ({...item, price: (item.price * 0.8).toFixed(2), title: `🔥 СКИДКА: ${item.title}` }));
    renderCards(discounted);
});

//2
document.getElementById('btnFilter').addEventListener('click', () => {
    const cheap = catalogData.filter(item => item.price<100);
    renderCards(cheap);
});

//3
document.getElementById('btnReduce').addEventListener('click', () => {
    const digitOnly = catalogData.reduce((acc, item) => {
        if (item.category === 'Design') acc.push(item);
        return acc;
    }, []);
    renderCards(digitOnly);
});

//4
document.getElementById('btnSort').addEventListener('click', () => {
    const sorted = [...catalogData].sort((a, b) => a.rating - b.rating);
    renderCards(sorted);
});

//5
document.getElementById('btnSlice').addEventListener('click', () => {
    const slised = catalogData.slice(4, 6);
    renderCards(slised);
});

//6
document.getElementById('btnReverse').addEventListener('click', () => {
    const reversed = [...catalogData].reverse();
    renderCards(reversed);
});

//7
document.getElementById('btnFind').addEventListener('click', () => {
    const found = catalogData.find(item => item.id === 3)
    renderCards(found ? [found] : []);
});

//8
document.getElementById('btnConcat').addEventListener('click', () => {
    const bonusCourse = { id: 99, title: '🎁 СЕКРЕТНЫЙ КУРС', description: 'Добавлен через concat()', price: 999, rating: 5.0, category: 'Secret', imageUrl: './Image/Catalog/catalog__img__5.jpg' };
    const merged = catalogData.concat(bonusCourse);
    renderCards(merged);
});

//9
document.getElementById('btnSplice').addEventListener('click', () => {
    const splicedArrey = [...catalogData];
    splicedArrey.splice(0, 5);
    renderCards(splicedArrey);
});

//10
document.getElementById('btnShift').addEventListener('click', () => {
    const shiftedArrey = [...catalogData];
    shiftedArrey.shift();
    renderCards(shiftedArrey);
});


const searchInput = document.getElementById('searchInput');
const categorySelect = document.getElementById('categorySelect');
const sortSelect = document.getElementById('sortSelect');
const btnReset = document.getElementById('btnReset');

function applyFilters() {
    const query = searchInput.value.toLowerCase();
    const category = categorySelect.value;
    const sortBy = sortSelect.value;


    let filteredData = catalogData.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(query) || 
                              item.description.toLowerCase().includes(query);
        const matchesCategory = category === 'All' || item.category === category;
        
        return matchesSearch && matchesCategory;
    });


    if (sortBy === 'priceAsc') {
        filteredData.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'priceDesc') {
        filteredData.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'nameAsc') {
        filteredData.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'ratingDesc') {
        filteredData.sort((a, b) => b.rating - a.rating);
    }

    renderCards(filteredData);
}

searchInput.addEventListener('input', applyFilters);
categorySelect.addEventListener('change', applyFilters);
sortSelect.addEventListener('change', applyFilters);

btnReset.addEventListener('click', () => {
    searchInput.value = '';
    categorySelect.value = 'All';
    sortSelect.value = 'default';
    renderCards(catalogData);
});