import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# First, insert screen-painting-test-2 after screen-painting-test
painting_test_end = content.find('</section>', content.find('id="screen-painting-test"')) + 10

painting_test_2_html = """
    <!-- 6.6. PAINTING TEST 2 -->
    <section id="screen-painting-test-2" class="screen">
      <div class="screen-header">
        <div class="screen-header-left">PROJECT</div>
        <div class="screen-header-center">
          <div class="step-container">
            <!-- Will be replaced below -->
          </div>
        </div>
        <div class="screen-header-right">ABOUT</div>
      </div>
      
      <div class="content-wrapper test-wrapper">
        <div class="test-header">
          <h2 class="test-title">AI가 학습한 원본 이미지는 무엇일까요?</h2>
          <p class="test-subtitle">* 하나만 선택하세요</p>
          <div class="selection-count">8/9</div>
        </div>
        <div class="test-body">
          <div class="gallery-grid grid-image" id="painting-grid-2">
            <!-- Injected via JS -->
          </div>
        </div>
        <div class="bottom-navigation">
          <button class="prev-btn" id="btn-painting2-prev">이전</button>
          <button class="editorial-btn disabled" id="btn-painting2-next">다음</button>
        </div>
      </div>
    </section>
"""

content = content[:painting_test_end] + "\n" + painting_test_2_html + content[painting_test_end:]

# Now replace step-containers in each section
sections_with_steps = [
    'screen-pretest', 'screen-image-test', 'screen-image-test-2', 'screen-image-test-3', 
    'screen-image-test-4', 'screen-image-test-5', 'screen-webtoon-test', 'screen-painting-test',
    'screen-painting-test-2', 'screen-text-test'
]

# They correspond to active steps 1 to 9 (pretest and image-test share 1? Yes, pretest is step 1, image-test is step 1)
active_step_map = {
    'screen-pretest': 1,
    'screen-image-test': 1,
    'screen-image-test-2': 2,
    'screen-image-test-3': 3,
    'screen-image-test-4': 4,
    'screen-image-test-5': 5,
    'screen-webtoon-test': 6,
    'screen-painting-test': 7,
    'screen-painting-test-2': 8,
    'screen-text-test': 9
}

def generate_step_html(active_step):
    lines = ['<div class="step-container">']
    for i in range(1, 10):
        if i < active_step:
            node_cls = 'step-node completed'
            line_cls = 'step-line completed'
        elif i == active_step:
            node_cls = 'step-node active'
            line_cls = 'step-line'
        else:
            node_cls = 'step-node'
            line_cls = 'step-line'
            
        lines.append(f'            <div class="{node_cls}">{i}</div>')
        if i < 9:
            lines.append(f'            <div class="{line_cls}"></div>')
    lines.append('          </div>')
    return '\n'.join(lines)

for section_id in sections_with_steps:
    section_start = content.find(f'id="{section_id}"')
    if section_start == -1:
        print(f"Warning: {section_id} not found")
        continue
    
    container_start = content.find('<div class="step-container">', section_start)
    container_end = content.find('</div>\n        </div>\n        <div class="screen-header-right">ABOUT</div>', container_start)
    if container_end == -1:
        # Fallback search
        container_end = content.find('</div>\n        </div>', container_start)
        
    old_container = content[container_start:container_end]
    new_container = generate_step_html(active_step_map[section_id])
    
    content = content[:container_start] + new_container + content[container_end:]

# Update selection counts in headers
# 1/8 -> 1/9, 2/8 -> 2/9, etc.
# Wait, pretest doesn't have selection-count.
count_map = {
    'screen-image-test': '1/9',
    'screen-image-test-2': '2/9',
    'screen-image-test-3': '3/9',
    'screen-image-test-4': '4/9',
    'screen-image-test-5': '5/9',
    'screen-webtoon-test': '6/9',
    'screen-painting-test': '7/9',
    'screen-painting-test-2': '8/9',
    'screen-text-test': '9/9'
}

for section_id, new_count in count_map.items():
    section_start = content.find(f'id="{section_id}"')
    if section_start != -1:
        count_start = content.find('<div class="selection-count">', section_start)
        if count_start != -1 and count_start < content.find('</section>', section_start):
            count_end = content.find('</div>', count_start)
            content = content[:count_start] + f'<div class="selection-count">{new_count}' + content[count_end:]

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
