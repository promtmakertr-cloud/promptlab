'use client';

const templates = [
  {
    category: 'Pazarlama',
    emoji: '📢',
    items: [
      { label: 'Soğuk E-posta', value: 'B2B SaaS ürünü için yüksek dönüşümlü soğuk e-posta metni yaz' },
      { label: 'Sosyal Medya', value: 'Yeni ürün lansmanı için Instagram ve LinkedIn gönderisi oluştur' },
      { label: 'Blog Yazısı', value: 'SEO odaklı, yapay zeka araçları hakkında 1500 kelimelik blog yazısı yaz' },
    ],
  },
  {
    category: 'Görsel Üretim',
    emoji: '🎨',
    items: [
      { label: 'Sinematik Portre', value: 'Yağmurlu bir şehirde sinematik atmosfer içeren, dramatik ışıklı portre fotoğrafı' },
      { label: 'Moda Fotoğrafı', value: 'Avrupa sokaklarında lüks sokak modası fotoğraf çekimi' },
      { label: '3D Karakter', value: 'Sokak modasına sahip, stilize edilmiş koleksiyonluk 3D karikatür karakter tasarımı' },
    ],
  },
  {
    category: 'Kariyer & Strateji',
    emoji: '🚀',
    items: [
      { label: 'Kariyer Yol Haritası', value: 'Yazılım mühendisliğinden ürün yönetimine geçiş için stratejik kariyer yol haritası' },
      { label: 'LinkedIn Profili', value: 'Dikkat çeken ve iş teklifleri alan LinkedIn profil özeti yaz' },
      { label: 'Müzakere Stratejisi', value: 'Maaş müzakeresinde kullanılacak ikna edici argümanlar ve strateji geliştir' },
    ],
  },
  {
    category: 'Yazılım & Teknik',
    emoji: '💻',
    items: [
      { label: 'Kod İnceleme', value: 'Senior yazılım mühendisi bakış açısıyla kod inceleme ve iyileştirme önerileri' },
      { label: 'Teknik Döküman', value: 'REST API için kapsamlı teknik dokümantasyon yaz' },
      { label: 'Mimari Tasarım', value: 'Yüksek trafikli e-ticaret platformu için ölçeklenebilir sistem mimarisi tasarla' },
    ],
  },
];

const PromptTemplates = ({ onSelect }) => {
  return (
    <div style={{ padding: '1.5rem 0' }}>
      <h2 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '1rem', fontWeight: '600' }}>
        ⚡ Hazır Şablonlar
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        {templates.map((group) => (
          <div
            key={group.category}
            style={{
              background: '#111',
              border: '1px solid #222',
              borderRadius: '10px',
              padding: '1rem',
            }}
          >
            <div style={{ color: '#aaa', fontSize: '0.8rem', marginBottom: '0.6rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {group.emoji} {group.category}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {group.items.map((item) => (
                <button
                  key={item.label}
                  onClick={() => onSelect(item.value)}
                  style={{
                    background: 'none',
                    border: '1px solid #2a2a2a',
                    borderRadius: '6px',
                    padding: '0.5rem 0.75rem',
                    color: '#ccc',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'border-color 0.2s, color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#0070f3';
                    e.currentTarget.style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#2a2a2a';
                    e.currentTarget.style.color = '#ccc';
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PromptTemplates;
