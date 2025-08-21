import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

/* 체크 아이콘 */
function CheckIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

/* 카드 컴포넌트 */
function EchoCard({ card, isViewed, onView, cardType }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCardClick = () => {
    if (!isExpanded) {
      setIsExpanded(true);
      onView(card.id || `${cardType}-${card.title}`);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`
        relative p-6 rounded-2xl cursor-pointer transition-all duration-300
        ${isExpanded 
          ? 'bg-white shadow-xl scale-[1.02]' 
          : 'bg-white/70 hover:bg-white/90 shadow-md hover:shadow-lg'
        }
        ${isViewed ? 'ring-2 ring-green-400' : ''}
      `}
    >
      {/* 체크 마크 */}
      {isViewed && (
        <div className="absolute top-4 right-4 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
          <CheckIcon className="w-4 h-4 text-white" />
        </div>
      )}

      {/* 카드 제목 */}
      <h3 className="text-lg font-bold text-gray-800 mb-3">
        {card.title}
      </h3>

      {/* 카드 내용 */}
      {isExpanded ? (
        <div className="space-y-3">
          <p className="text-gray-700 leading-relaxed">
            {card.content}
          </p>
          
          {/* 인용문 정보 */}
          {card.speaker && (
            <div className="pt-3 border-t border-gray-200">
              <p className="text-sm text-gray-500">- {card.speaker}</p>
            </div>
          )}
          
          {/* 뉴스 링크 */}
          {card.news_link && (
            <a
              href={card.news_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-sm text-blue-600 hover:text-blue-800"
              onClick={(e) => e.stopPropagation()}
            >
              📰 관련 뉴스 보기
            </a>
          )}
        </div>
      ) : (
        <div>
          <p className="text-gray-600 text-sm line-clamp-2">
            {card.content}
          </p>
          <p className="text-blue-600 text-sm mt-2 font-medium">
            탭하여 전체 읽기 →
          </p>
        </div>
      )}
    </div>
  );
}

export default function EchoCardsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sessionData, setSessionData] = useState(null);
  const [viewedCards, setViewedCards] = useState(new Set());
  const [showDashboardButton, setShowDashboardButton] = useState(false);
  const [activeTab, setActiveTab] = useState('empathy');

  // 세션 데이터 로드
  useEffect(() => {
    const stateData = location.state?.sessionData;
    const storedData = sessionStorage.getItem('meariSessionData');
    
    if (stateData) {
      setSessionData(stateData);
    } else if (storedData) {
      setSessionData(JSON.parse(storedData));
    }

    // 이전에 본 카드 복원
    const savedViewed = localStorage.getItem('viewedEchoCards');
    if (savedViewed) {
      setViewedCards(new Set(JSON.parse(savedViewed)));
    }
  }, [location]);

  // 카드 데이터 파싱
  const empathyCards = sessionData?.cards?.empathy?.cards || [];
  const reflectionCards = sessionData?.cards?.reflection?.cards || [];
  const growthCards = sessionData?.cards?.growth?.cards || [
    sessionData?.cards?.growth?.information,
    sessionData?.cards?.growth?.experience,
    sessionData?.cards?.growth?.support
  ].filter(Boolean);

  const totalCards = empathyCards.length + reflectionCards.length + growthCards.length;

  // 카드 확인 처리
  const markCardAsViewed = (cardId) => {
    const newViewedCards = new Set(viewedCards);
    newViewedCards.add(cardId);
    setViewedCards(newViewedCards);
    
    // 로컬 스토리지에 저장
    localStorage.setItem('viewedEchoCards', JSON.stringify([...newViewedCards]));
    
    // 모든 카드를 봤는지 체크
    if (newViewedCards.size === totalCards && totalCards > 0) {
      setTimeout(() => {
        setShowDashboardButton(true);
        // 축하 애니메이션
        celebrateCompletion();
      }, 500);
    }
  };

  // 축하 애니메이션
  const celebrateCompletion = () => {
    // 간단한 축하 효과 (confetti 대신)
    const celebration = document.createElement('div');
    celebration.innerHTML = '🎉';
    celebration.className = 'fixed top-1/2 left-1/2 text-6xl animate-ping';
    document.body.appendChild(celebration);
    setTimeout(() => celebration.remove(), 1000);
  };

  const tabs = [
    { id: 'empathy', label: '공감의 메아리', count: empathyCards.length },
    { id: 'reflection', label: '성찰의 메아리', count: reflectionCards.length },
    { id: 'growth', label: '성장의 메아리', count: growthCards.length }
  ];

  const getActiveCards = () => {
    switch(activeTab) {
      case 'empathy': return empathyCards;
      case 'reflection': return reflectionCards;
      case 'growth': return growthCards;
      default: return [];
    }
  };

  // 각 탭별 진행률 계산
  const getTabProgress = (tabId) => {
    let cards = [];
    switch(tabId) {
      case 'empathy': cards = empathyCards; break;
      case 'reflection': cards = reflectionCards; break;
      case 'growth': cards = growthCards; break;
    }
    
    const viewedCount = cards.filter(card => 
      viewedCards.has(card.id || `${tabId}-${card.title}`)
    ).length;
    
    return { viewed: viewedCount, total: cards.length };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">메아리 카드</h1>
        </div>
      </header>

      {/* 탭 네비게이션 */}
      <div className="max-w-4xl mx-auto px-4 mt-6">
        <div className="flex space-x-2 bg-white rounded-xl p-1 shadow-md">
          {tabs.map(tab => {
            const progress = getTabProgress(tab.id);
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex-1 py-3 px-4 rounded-lg transition-all relative
                  ${activeTab === tab.id 
                    ? 'bg-blue-500 text-white shadow-lg' 
                    : 'text-gray-600 hover:bg-gray-100'
                  }
                `}
              >
                <div className="font-medium">{tab.label}</div>
                <div className="text-xs mt-1">
                  {progress.viewed}/{progress.total} 완료
                </div>
                {progress.viewed === progress.total && progress.total > 0 && (
                  <span className="absolute top-2 right-2 text-green-400">✓</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 카드 그리드 */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {getActiveCards().map((card, index) => (
            <EchoCard
              key={card.id || `${activeTab}-${index}`}
              card={card}
              isViewed={viewedCards.has(card.id || `${activeTab}-${card.title}`)}
              onView={markCardAsViewed}
              cardType={activeTab}
            />
          ))}
        </div>
      </main>

      {/* 진행 상황 바 */}
      <div className="fixed bottom-24 left-0 right-0 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-full shadow-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">전체 진행률</span>
              <span className="text-sm font-bold text-gray-800">
                {viewedCards.size} / {totalCards} 카드
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-400 to-green-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(viewedCards.size / totalCards) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 대시보드 이동 버튼 */}
      {showDashboardButton && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-transparent">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-3">
              <span className="text-2xl">✨</span>
              <p className="text-lg font-bold text-gray-800">
                모든 메아리를 확인했어요!
              </p>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full max-w-md py-4 px-8 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold rounded-full shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
            >
              <span className="text-xl mr-2">🌳</span>
              대시보드로 이동하기
            </button>
            <p className="text-gray-500 text-sm mt-2">
              마음나무가 기다리고 있어요
            </p>
          </div>
        </div>
      )}
    </div>
  );
}