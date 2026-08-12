export type Language = 'vi' | 'en';

export type TranslationKeys = {
  nav: {
    home: string;
    alerts: string;
    survival: string;
    research: string;
    admin: string;
    login: string;
    register: string;
    logout: string;
    hello: string;
  };
  common: {
    refresh: string;
    loading: string;
    error: string;
    success: string;
    cancel: string;
    delete: string;
    confirmDelete: string;
    close: string;
    save: string;
    retry: string;
    offlineTitle: string;
    offlineDesc: string;
    footerText: string;
  };
  home: {
    title: string;
    subtitle: string;
    activeAlerts: string;
    weatherStation: string;
    safetyIndex: string;
    quickActions: string;
    emergencyCall: string;
    reportIncident: string;
    evacuationMap: string;
    aiAssistant: string;
  };
  weather: {
    title: string;
    currentTemp: string;
    humidity: string;
    windSpeed: string;
    pressure: string;
    uvIndex: string;
    rainfall: string;
    lastUpdated: string;
    refreshData: string;
    statusNormal: string;
    statusWarning: string;
    statusDanger: string;
    statusLabel: string;
    location: string;
  };
  alerts: {
    title: string;
    subtitle: string;
    filterAll: string;
    filterEmergency: string;
    filterWarning: string;
    filterAdvisory: string;
    riskHigh: string;
    riskMedium: string;
    riskLow: string;
    viewDetails: string;
    locationLabel: string;
    timeLabel: string;
    sourceLabel: string;
    emptyTitle: string;
    emptyDesc: string;
    showing: string;
  };
  survival: {
    title: string;
    subtitle: string;
    cpr: string;
    flood: string;
    earthquake: string;
    fire: string;
    water: string;
    firstAid: string;
    step: string;
    warningNote: string;
    emergencyContacts: string;
    callNow: string;
    searchPlaceholder: string;
    searchResults: string;
    noResults: string;
    backToCat: string;
    back: string;
    guideLabel: string;
    offlineNotice: string;
  };
  research: {
    title: string;
    subtitle: string;
    tabTrends: string;
    tabModels: string;
    tabReports: string;
    exportData: string;
    filterRegion: string;
    chartTitle: string;
    layerLsm: string;
    layerDisaster: string;
    layerElevation: string;
    statsTitle: string;
    totalPoints: string;
    dataLayer: string;
    riskDist: string;
  };
  bot: {
    title: string;
    subtitle: string;
    placeholder: string;
    send: string;
    welcome: string;
    errorMsg: string;
    replyWeather: string;
    replyCpr: string;
    replyFlood: string;
    replyWater: string;
    quickWeather: string;
    quickCpr: string;
    quickFlood: string;
    quickWater: string;
    openBot: string;
    closeBot: string;
    tooltipExpand: string;
    tooltipCompress: string;
    tooltipClose: string;
    expandTooltip: string;
    collapseTooltip: string;
    closeTooltip: string;
  };
  admin: {
    controlRoom: string;
    title: string;
    subtitle: string;
    navUpload: string;
    navDocs: string;
    navManage: string;
    kbTitle: string;
    kbSubtitle: string;
    uploadBtn: string;
    step1: string;
    step1Note: string;
    dryRun: string;
    analyzing: string;
    step2: string;
    commit: string;
    committing: string;
    chunks: string;
    kbDocsTitle: string;
    kbDocsSubtitle: string;
    docsTitle: string;
    docsSubtitle: string;
    refresh: string;
    refreshBtn: string;
    delete: string;
    deleteBtn: string;
    cancel: string;
    confirmDelete: string;
    deleteConfirmQuestion: string;
    loading: string;
    statsDocs: string;
    statsChunks: string;
    statsAvg: string;
    totalDocs: string;
    totalChunks: string;
    avgChunks: string;
    viewChunks: string;
    viewingChunks: string;
    clickToView: string;
    noDocs: string;
    emptyDocs: string;
    statusLabel: string;
    statusReady: string;
    statusProcessing: string;
    statusFailed: string;
    statusReadyDesc: string;
    statusProcessingDesc: string;
  };
};

export const translations: Record<Language, TranslationKeys> = {
  vi: {
    nav: {
      home: 'Trang chủ',
      alerts: 'Cảnh báo',
      survival: 'Cẩm nang',
      research: '📊 Nghiên cứu',
      admin: '⚙️ Quản trị',
      login: 'Đăng nhập',
      register: 'Đăng ký',
      logout: 'Đăng xuất',
      hello: 'Chào',
    },
    common: {
      refresh: 'Làm mới',
      loading: 'Đang tải...',
      error: 'Có lỗi xảy ra',
      success: 'Thành công',
      cancel: 'Hủy',
      delete: 'Xóa',
      confirmDelete: 'Xác nhận xóa?',
      close: 'Đóng',
      save: 'Lưu',
      retry: 'Thử lại',
      offlineTitle: 'Không có kết nối',
      offlineDesc: 'Vui lòng kiểm tra mạng và thử lại',
      footerText: 'Lumos History Bot - Trợ lý Lịch sử & Địa lý Tiểu học (Lớp 4 & 5)',
    },
    home: {
      title: 'Sân chơi Lịch sử & Địa lý Tiểu học',
      subtitle: 'Khám phá lịch sử dựng nước, giữ nước và địa lý Việt Nam cùng Cụ Rùa Thông Thái',
      activeAlerts: 'Sự kiện nổi bật',
      weatherStation: 'Trạm Kiến thức',
      safetyIndex: 'Chỉ số Thông thái',
      quickActions: 'Khám phá Nhanh',
      emergencyCall: 'Tổng đài Học tập',
      reportIncident: 'Gửi thắc mắc',
      evacuationMap: 'Bản đồ Lịch sử',
      aiAssistant: 'Hỏi Cụ Rùa AI',
    },
    weather: {
      title: 'Thông tin học tập',
      currentTemp: 'Điểm số',
      humidity: 'Tiến độ',
      windSpeed: 'Tốc độ',
      pressure: 'Độ chăm',
      uvIndex: 'Cấp độ',
      rainfall: 'Bài học',
      lastUpdated: 'Cập nhật lúc',
      refreshData: 'Làm mới dữ liệu',
      statusNormal: 'Xuất sắc',
      statusWarning: 'Cố gắng',
      statusDanger: 'Cần chú ý',
      statusLabel: 'Trạng thái',
      location: 'Việt Nam',
    },
    alerts: {
      title: 'Góc Khám Phá Lịch Sử',
      subtitle: 'Danh sách bài học và mốc lịch sử quan trọng trong SGK Lớp 4 & 5',
      filterAll: 'Tất cả',
      filterEmergency: 'Lịch sử Lớp 4',
      filterWarning: 'Lịch sử Lớp 5',
      filterAdvisory: 'Địa lý Việt Nam',
      riskHigh: 'Bài học chính',
      riskMedium: 'Đọc thêm',
      riskLow: 'Ôn tập',
      viewDetails: 'Đọc bài học',
      locationLabel: 'Triều đại / Thời kỳ:',
      timeLabel: 'Thời gian:',
      sourceLabel: 'Sách giáo khoa:',
      emptyTitle: 'Chưa chọn bài học',
      emptyDesc: 'Cụ Rùa đang chuẩn bị nội dung kiến thức tiếp theo...',
      showing: 'Hiển thị',
    },
    survival: {
      title: 'Cẩm nang Lịch sử & Địa lý SGK',
      subtitle: 'Kiến thức cốt lõi SGK Lớp 4 & Lớp 5 Bộ Giáo Dục & Đào Tạo - Hoạt động Offline',
      cpr: 'Thời Hùng Vương - An Dương Vương',
      flood: 'Các triều đại Lý - Trần - Lê',
      earthquake: 'Phong trào Tây Sơn & Nhà Nguyễn',
      fire: 'Kháng chiến chống Pháp & Mỹ',
      water: 'Địa lý Việt Nam & Biển đảo',
      firstAid: 'Ôn tập tổng hợp Lớp 4 & 5',
      step: 'Mục',
      warningNote: 'Ghi nhớ cốt lõi',
      emergencyContacts: 'Tổng đài Tư vấn Học tập',
      callNow: 'Liên hệ',
      searchPlaceholder: 'Tìm kiếm nhân vật, sự kiện lịch sử...',
      searchResults: 'Kết quả tìm kiếm',
      noResults: 'Không tìm thấy sự kiện phù hợp',
      backToCat: 'Quay lại chủ đề',
      back: 'Quay lại',
      guideLabel: 'Nội dung chi tiết:',
      offlineNotice: '📱 Nội dung này được lưu trữ và hoạt động offline để học tập mọi lúc',
    },
    research: {
      title: 'Bản đồ Lịch sử & Địa lý',
      subtitle: 'Trực quan hóa các chiến công lịch sử và địa hình địa lý Việt Nam',
      tabTrends: 'Tiến trình Lịch sử',
      tabModels: 'Bản đồ Trận đánh',
      tabReports: 'Báo cáo Học tập',
      exportData: 'Xuất dữ liệu bài học',
      filterRegion: 'Lọc theo thời kỳ',
      chartTitle: 'Biểu đồ Số lượng Bài học theo Triều đại',
      layerLsm: '🗺️ Bản đồ Địa lý',
      layerDisaster: '⚔️ Trận đánh nổi tiếng',
      layerElevation: '⛰️ Địa hình',
      statsTitle: 'Thống kê bài học',
      totalPoints: 'Tổng mốc lịch sử:',
      dataLayer: 'Thời kỳ đang chọn:',
      riskDist: 'Phân bố bài học',
    },
    bot: {
      title: 'Cụ Rùa Thông Thái',
      subtitle: 'Trợ lý AI Lịch sử & Địa lý SGK • Sẵn sàng hỗ trợ',
      placeholder: 'Hỏi Cụ Rùa về bài học Lịch sử, Địa lý... (Enter để gửi)',
      send: 'Gửi',
      welcome: 'Xin chào cháu! Cụ Rùa Thông Thái đây 🐢. Cụ có thể giúp gì cho cháu về bài học Lịch sử và Địa lý Tiểu học (Lớp 4 & 5) hôm nay?',
      errorMsg: 'Xin lỗi cháu, Cụ Rùa hiện không thể kết nối tới máy chủ. Vui lòng thử lại sau nhé!',
      replyWeather: '🏰 Vua Hùng dựng nước Văn Lang',
      replyCpr: '⚔️ Chiến thắng Bạch Đằng năm 938',
      replyFlood: '🗺️ Địa lý Việt Nam (Hình dải S)',
      replyWater: '📜 Sông Hồng & Văn hóa Lúa nước',
      quickWeather: 'Vua Hùng dựng nước',
      quickCpr: 'Chiến thắng Bạch Đằng',
      quickFlood: 'Địa lý Việt Nam',
      quickWater: 'Sông Hồng & Lúa nước',
      openBot: 'Hỏi Cụ Rùa',
      closeBot: 'Đóng Cụ Rùa',
      tooltipExpand: 'Phóng to',
      tooltipCompress: 'Thu nhỏ',
      tooltipClose: 'Đóng',
      expandTooltip: 'Phóng to',
      collapseTooltip: 'Thu nhỏ (Esc)',
      closeTooltip: 'Đóng (Esc)',
    },
    admin: {
      controlRoom: 'Trung tâm Điều hành',
      title: 'Trung tâm Điều hành',
      subtitle: 'Bảng điều khiển Quản trị',
      navUpload: 'Tải lên Tài liệu',
      navDocs: 'Quản lý Tài liệu',
      navManage: 'Quản lý Tài liệu',
      kbTitle: 'Quản lý Tài liệu',
      kbSubtitle: 'Tải lên tài liệu mới để nạp vào hệ thống RAG',
      uploadBtn: 'Tải lên & Nạp dữ liệu',
      step1: 'Bước 1: Tải tài liệu & Phân tích',
      step1Note: 'Hệ thống sử dụng Hierarchical Chunking để bóc tách và tạo preview trước khi lưu vào cơ sở dữ liệu vector.',
      dryRun: '🔍 Phân tích thử',
      analyzing: '⏳ Đang phân tích...',
      step2: 'Bước 2: Kiểm duyệt & Nạp vào RAG',
      commit: '🚀 Duyệt & Nạp vào RAG',
      committing: '⏳ Đang lưu vào CSDL & Vector DB...',
      chunks: 'chunks',
      kbDocsTitle: 'Quản lý Tài liệu',
      kbDocsSubtitle: 'Danh sách tài liệu đã nạp vào hệ thống · Click để xem chunks',
      docsTitle: 'Quản lý Tài liệu',
      docsSubtitle: 'Danh sách tài liệu đã nạp vào hệ thống · Click để xem chi tiết chunks',
      refresh: 'Làm mới',
      refreshBtn: 'Làm mới',
      delete: 'Xóa',
      deleteBtn: 'Xóa',
      cancel: 'Hủy',
      confirmDelete: 'Xác nhận xóa?',
      deleteConfirmQuestion: 'Xác nhận xóa?',
      loading: 'Đang tải...',
      statsDocs: 'Tài liệu',
      statsChunks: 'Tổng chunks',
      statsAvg: 'TB chunks/file',
      totalDocs: 'Tổng tài liệu',
      totalChunks: 'Tổng chunks',
      avgChunks: 'TB chunks/file',
      viewChunks: 'Xem chunks →',
      viewingChunks: 'Đang xem chunks ↓',
      clickToView: 'Click để xem chunks →',
      noDocs: 'Chưa có tài liệu nào được nạp vào hệ thống.',
      emptyDocs: 'Chưa có tài liệu nào được nạp vào hệ thống.',
      statusLabel: 'Trạng thái',
      statusReady: 'Sẵn sàng',
      statusProcessing: 'Đang xử lý',
      statusFailed: 'Lỗi',
      statusReadyDesc: 'Đã nạp và lập chỉ mục trong RAG Vector DB',
      statusProcessingDesc: 'Đang bóc tách và tạo vector nhúng',
    },
  },
  en: {
    nav: {
      home: 'Home',
      alerts: 'Alerts',
      survival: 'Handbook',
      research: '📊 Research',
      admin: '⚙️ Admin',
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
      hello: 'Hi',
    },
    common: {
      refresh: 'Refresh',
      loading: 'Loading...',
      error: 'An error occurred',
      success: 'Success',
      cancel: 'Cancel',
      delete: 'Delete',
      confirmDelete: 'Confirm delete?',
      close: 'Close',
      save: 'Save',
      retry: 'Retry',
      offlineTitle: 'No Connection',
      offlineDesc: 'Please check your network and try again',
      footerText: 'Lumos History Bot - Elementary History & Geography Assistant (Grades 4 & 5)',
    },
    home: {
      title: 'Elementary History & Geography Playground',
      subtitle: 'Explore Vietnamese history and geography with Wise Turtle AI Assistant',
      activeAlerts: 'Featured Events',
      weatherStation: 'Knowledge Station',
      safetyIndex: 'Wisdom Index',
      quickActions: 'Quick Explore',
      emergencyCall: 'Learning Hotline',
      reportIncident: 'Ask Question',
      evacuationMap: 'Historical Map',
      aiAssistant: 'Ask Turtle AI',
    },
    weather: {
      title: 'Learning Info',
      currentTemp: 'Score',
      humidity: 'Progress',
      windSpeed: 'Speed',
      pressure: 'Diligence',
      uvIndex: 'Level',
      rainfall: 'Lessons',
      lastUpdated: 'Updated at',
      refreshData: 'Refresh Data',
      statusNormal: 'Excellent',
      statusWarning: 'Keep Trying',
      statusDanger: 'Needs Attention',
      statusLabel: 'Status',
      location: 'Vietnam',
    },
    alerts: {
      title: 'History Discovery Zone',
      subtitle: 'Key historical events and lessons for Grades 4 & 5 textbooks',
      filterAll: 'All',
      filterEmergency: 'Grade 4 History',
      filterWarning: 'Grade 5 History',
      filterAdvisory: 'Vietnam Geography',
      riskHigh: 'Core Lesson',
      riskMedium: 'Extra Reading',
      riskLow: 'Review',
      viewDetails: 'Read Lesson',
      locationLabel: 'Dynasty / Era:',
      timeLabel: 'Time:',
      sourceLabel: 'Textbook:',
      emptyTitle: 'No lesson selected',
      emptyDesc: 'Wise Turtle is preparing the next learning materials...',
      showing: 'Showing',
    },
    survival: {
      title: 'History & Geography Handbook',
      subtitle: 'Core knowledge for Grades 4 & 5 Ministry of Education Textbooks - Works Offline',
      cpr: 'Hung Kings - An Duong Vuong Era',
      flood: 'Ly - Tran - Le Dynasties',
      earthquake: 'Tay Son & Nguyen Dynasty',
      fire: 'French & American Resistance',
      water: 'Vietnam Geography & Islands',
      firstAid: 'General Review Grades 4 & 5',
      step: 'Item',
      warningNote: 'Key Takeaways',
      emergencyContacts: 'Learning Hotline',
      callNow: 'Contact',
      searchPlaceholder: 'Search historical figures, events...',
      searchResults: 'Search results',
      noResults: 'No matching events found',
      backToCat: 'Back to topics',
      back: 'Back',
      guideLabel: 'Detailed content:',
      offlineNotice: '📱 This content is cached and works offline for learning anytime',
    },
    research: {
      title: 'Historical & Geographical Map',
      subtitle: 'Visualizing historical battles and geography of Vietnam',
      tabTrends: 'Historical Timeline',
      tabModels: 'Battle Maps',
      tabReports: 'Learning Reports',
      exportData: 'Export Lesson Data',
      filterRegion: 'Filter by Era',
      chartTitle: 'Lessons Distribution by Dynasty',
      layerLsm: '🗺️ Geography Map',
      layerDisaster: '⚔️ Famous Battles',
      layerElevation: '⛰️ Terrain',
      statsTitle: 'Lesson Statistics',
      totalPoints: 'Total Historical Milestones:',
      dataLayer: 'Active Era:',
      riskDist: 'Lesson Distribution',
    },
    bot: {
      title: 'Wise Turtle AI',
      subtitle: 'History & Geography AI Assistant • Ready to help',
      placeholder: 'Ask Wise Turtle about History, Geography... (Press Enter)',
      send: 'Send',
      welcome: 'Hello! I am Wise Turtle 🐢. How can I help you with your Grades 4 & 5 History and Geography lessons today?',
      errorMsg: 'Sorry, Wise Turtle cannot connect to the server right now. Please try again later!',
      replyWeather: '🏰 Hung Kings & Van Lang Kingdom',
      replyCpr: '⚔️ Bach Dang Victory 938',
      replyFlood: '🗺️ Geography of Vietnam',
      replyWater: '📜 Red River & Wet Rice Culture',
      quickWeather: 'Hung Kings Era',
      quickCpr: 'Bach Dang Battle',
      quickFlood: 'Vietnam Geography',
      quickWater: 'Red River Culture',
      openBot: 'Ask Wise Turtle',
      closeBot: 'Close Wise Turtle',
      tooltipExpand: 'Expand',
      tooltipCompress: 'Compress',
      tooltipClose: 'Close',
      expandTooltip: 'Expand',
      collapseTooltip: 'Compress (Esc)',
      closeTooltip: 'Close (Esc)',
    },
    admin: {
      controlRoom: 'Control Room',
      title: 'Control Room',
      subtitle: 'Admin Dashboard',
      navUpload: 'Upload Documents',
      navDocs: 'Document Management',
      navManage: 'Document Management',
      kbTitle: 'Document Management',
      kbSubtitle: 'Upload new documents to ingest into the RAG system',
      uploadBtn: 'Upload & Ingest',
      step1: 'Step 1: Upload & Analyze',
      step1Note: 'System uses Hierarchical Chunking to extract and create preview before saving to vector database.',
      dryRun: '🔍 Preliminary Analysis',
      analyzing: '⏳ Analyzing...',
      step2: 'Step 2: Review & Ingest into RAG',
      commit: '🚀 Approve & Ingest into RAG',
      committing: '⏳ Saving to DB & Vector DB...',
      chunks: 'chunks',
      kbDocsTitle: 'Document Management',
      kbDocsSubtitle: 'List of documents ingested into system · Click to inspect chunks',
      docsTitle: 'Document Management',
      docsSubtitle: 'List of documents ingested into system · Click to view chunk details',
      refresh: 'Refresh',
      refreshBtn: 'Refresh',
      delete: 'Delete',
      deleteBtn: 'Delete',
      cancel: 'Cancel',
      confirmDelete: 'Confirm delete?',
      deleteConfirmQuestion: 'Confirm delete?',
      loading: 'Loading...',
      statsDocs: 'Documents',
      statsChunks: 'Total Chunks',
      statsAvg: 'Avg Chunks/File',
      totalDocs: 'Total Documents',
      totalChunks: 'Total Chunks',
      avgChunks: 'Avg Chunks/File',
      viewChunks: 'View chunks →',
      viewingChunks: 'Viewing chunks ↓',
      clickToView: 'Click to view chunks →',
      noDocs: 'No documents ingested into system yet.',
      emptyDocs: 'No documents ingested into system yet.',
      statusLabel: 'Status',
      statusReady: 'Ready',
      statusProcessing: 'Processing',
      statusFailed: 'Failed',
      statusReadyDesc: 'Ingested and indexed in RAG Vector DB',
      statusProcessingDesc: 'Extracting and generating embeddings',
    },
  },
};
