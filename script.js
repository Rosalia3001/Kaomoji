// script.js
// 语言切换功能
document.addEventListener('DOMContentLoaded', function() {
    const langButtons = document.querySelectorAll('.lang-btn');
    let currentLang = 'zh'; // 默认中文
    
    // 语言数据
    const copyTexts = {
        'zh': '点击复制',
        'en': 'Click to copy',
        'ja': 'クリックでコピー'
    };
    
    const notificationTexts = {
        'zh': '已复制!',
        'en': 'Copied!',
        'ja': 'コピーしました!'
    };
    
    // 语言切换函数
    function switchLanguage(lang) {
        currentLang = lang;
        
        // 更新语言按钮状态
        langButtons.forEach(button => {
            if (button.getAttribute('data-lang') === lang) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
        
        // 更新所有带有data-zh、data-en和data-ja属性的元素
        document.querySelectorAll('[data-zh]').forEach(element => {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = element.getAttribute(`data-${lang}`);
            } else {
                // 对于包含颜文字的元素，只更新data-copy-text属性，不更新文本内容
                if (!element.classList.contains('kaomoji-item') && !element.classList.contains('cute-kaomoji')) {
                    element.textContent = element.getAttribute(`data-${lang}`);
                }
            }
        });
        
        // 更新复制提示文本
        document.querySelectorAll('.kaomoji-item').forEach(item => {
            item.setAttribute('data-copy-text', copyTexts[lang]);
        });
        
        // 更新通知文本
        document.getElementById('copy-notification').textContent = notificationTexts[lang];
    }
    
    // 绑定语言切换事件
    langButtons.forEach(button => {
        button.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            switchLanguage(lang);
            // 保存语言偏好到本地存储
            localStorage.setItem('preferred-language', lang);
        });
    });
    
    // 分类标签切换功能
    const tabButtons = document.querySelectorAll('.tab-btn');
    const categoryContents = document.querySelectorAll('.category-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 移除所有活动状态
            tabButtons.forEach(btn => btn.classList.remove('active'));
            categoryContents.forEach(content => content.classList.remove('active'));
            
            // 添加当前活动状态
            this.classList.add('active');
            const category = this.getAttribute('data-category');
            document.getElementById(category).classList.add('active');
        });
    });
    
    // 颜文字复制功能
    const kaomojiItems = document.querySelectorAll('.kaomoji-item');
    const copyNotification = document.getElementById('copy-notification');
    
    // 复制文本到剪贴板的函数
    function copyToClipboard(text) {
        // 使用现代剪贴板API
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(text);
        } else {
            // 备用方法：使用传统document.execCommand
            return new Promise((resolve, reject) => {
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                
                try {
                    const successful = document.execCommand('copy');
                    document.body.removeChild(textArea);
                    if (successful) {
                        resolve();
                    } else {
                        reject(new Error('复制失败'));
                    }
                } catch (err) {
                    document.body.removeChild(textArea);
                    reject(err);
                }
            });
        }
    }
    
    // 为每个颜文字项添加点击事件
    kaomojiItems.forEach(item => {
        item.addEventListener('click', function() {
            const textToCopy = this.getAttribute('data-kaomoji');
            
            copyToClipboard(textToCopy)
                .then(() => {
                    // 显示复制成功提示
                    copyNotification.classList.add('show');
                    
                    // 2秒后隐藏提示
                    setTimeout(() => {
                        copyNotification.classList.remove('show');
                    }, 2000);
                })
                .catch(err => {
                    console.error('复制失败: ', err);
                    // 可以添加更友好的错误提示
                    copyNotification.textContent = notificationTexts[currentLang] + ' (失败)';
                    copyNotification.classList.add('show');
                    
                    setTimeout(() => {
                        copyNotification.classList.remove('show');
                        copyNotification.textContent = notificationTexts[currentLang];
                    }, 2000);
                });
        });
    });
    
    // 添加一些可爱的交互效果
    const cuteKaomoji = document.querySelector('.cute-kaomoji');
    if (cuteKaomoji) {
        cuteKaomoji.addEventListener('mouseover', function() {
            this.style.transform = 'scale(1.2) rotate(5deg)';
            this.style.transition = 'all 0.3s ease';
        });
        
        cuteKaomoji.addEventListener('mouseout', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    }
    
    // 为颜文字项添加鼠标悬停效果
    kaomojiItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.05)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // 页面加载时的动画效果
    window.addEventListener('load', function() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease-in';
        
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
        
        // 添加分类内容的淡入效果
        const activeContent = document.querySelector('.category-content.active');
        if (activeContent) {
            activeContent.style.opacity = '0';
            activeContent.style.transform = 'translateY(20px)';
            activeContent.style.transition = 'all 0.5s ease';
            
            setTimeout(() => {
                activeContent.style.opacity = '1';
                activeContent.style.transform = 'translateY(0)';
            }, 300);
        }
    });
    
    // 分类切换时的动画效果
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            const content = document.getElementById(category);
            
            if (content) {
                content.style.opacity = '0';
                content.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    content.style.opacity = '1';
                    content.style.transform = 'translateY(0)';
                }, 300);
            }
        });
    });
    
    // 键盘快捷键支持
    document.addEventListener('keydown', function(event) {
        // 按ESC键关闭复制提示
        if (event.key === 'Escape') {
            copyNotification.classList.remove('show');
        }
        
        // 数字键1-5快速切换分类 (可选功能)
        if (event.key >= '1' && event.key <= '5') {
            const index = parseInt(event.key) - 1;
            const tabs = Array.from(tabButtons);
            if (tabs[index]) {
                tabs[index].click();
            }
        }
    });
    
    // 初始化语言设置（从本地存储读取或使用默认值）
    function initializeLanguage() {
        const savedLang = localStorage.getItem('preferred-language');
        if (savedLang && ['zh', 'en', 'ja'].includes(savedLang)) {
            switchLanguage(savedLang);
        } else {
            // 根据浏览器语言自动设置
            const browserLang = navigator.language.toLowerCase();
            if (browserLang.startsWith('zh')) {
                switchLanguage('zh');
            } else if (browserLang.startsWith('ja')) {
                switchLanguage('ja');
            } else {
                switchLanguage('en');
            }
        }
    }
    
    // 初始化
    initializeLanguage();
    
    console.log('可爱颜文字网站已加载完成！(◕‿◕✿)');
});