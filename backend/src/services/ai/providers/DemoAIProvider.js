const AIProvider = require('../AIProvider')

class DemoAIProvider extends AIProvider {
  async analyzeNotice(title = '', text = '') {
    const combined = `${title} ${text}`.toLowerCase()
    
    // Extract keywords
    const keywordCandidates = ['bca', 'mca', 'b.sc', 'semester', 'examination', 'timetable', 'practical', 'holiday', 'sports', 'admission', 'circular', 'workshop', 'seminar', 'assignment', 'fee', 'result']
    const keywords = keywordCandidates.filter(k => combined.includes(k))

    // Department detection
    let department = 'Department of Computer Science & IT'
    if (combined.includes('yoga') || combined.includes('indology')) department = 'School of Indology (Yoga & Theology)'
    else if (combined.includes('psychology')) department = 'Department of Psychology'
    else if (combined.includes('animation')) department = 'Department of Animation'
    else if (combined.includes('tourism')) department = 'Department of Tourism'
    else if (combined.includes('journalism') || combined.includes('mass')) department = 'Department of Journalism & Mass Comm.'
    else if (combined.includes('education')) department = 'Department of Education'
    else if (combined.includes('holiday') || combined.includes('general') || combined.includes('university')) department = 'Administration'

    // Category detection
    let category = 'Notice'
    if (combined.includes('exam') || combined.includes('practical') || combined.includes('paper')) category = 'Examination'
    else if (combined.includes('timetable') || combined.includes('schedule')) category = 'Timetable'
    else if (combined.includes('circular')) category = 'Circular'
    else if (combined.includes('holiday')) category = 'Holiday'
    else if (combined.includes('admission')) category = 'Admission'
    else if (combined.includes('event') || combined.includes('sports') || combined.includes('fest')) category = 'Event'
    else if (combined.includes('workshop')) category = 'Workshop'
    else if (combined.includes('assignment')) category = 'Assignment'

    // Priority detection
    let priority = 'Medium'
    if (combined.includes('urgent') || combined.includes('immediate') || combined.includes('examination') || combined.includes('postponed')) priority = 'High'
    else if (combined.includes('sports') || combined.includes('celebration') || combined.includes('optional')) priority = 'Low'

    // Course & Semester
    let course = 'BCA'
    if (combined.includes('mca')) course = 'MCA'
    else if (combined.includes('b.sc')) course = 'B.Sc IT'
    else if (combined.includes('m.sc')) course = 'M.Sc Computer Science'

    let semester = '2nd Semester'
    if (combined.includes('1st') || combined.includes('first')) semester = '1st Semester'
    else if (combined.includes('2nd') || combined.includes('second')) semester = '2nd Semester'
    else if (combined.includes('3rd') || combined.includes('third')) semester = '3rd Semester'
    else if (combined.includes('4th') || combined.includes('fourth')) semester = '4th Semester'
    else if (combined.includes('5th') || combined.includes('fifth')) semester = '5th Semester'
    else if (combined.includes('6th') || combined.includes('sixth')) semester = '6th Semester'
    else if (combined.includes('7th') || combined.includes('seventh')) semester = '7th Semester'

    // Target Audience
    let targetType = 'COURSE'
    if (category === 'Holiday' || category === 'Circular' || department === 'Administration') targetType = 'UNIVERSITY'
    else if (combined.includes('semester')) targetType = 'SEMESTER'

    const confidence = combined.includes('bca') || combined.includes('exam') ? 94 : 85

    return {
      departmentSuggestion: department,
      courseSuggestion: course,
      semesterSuggestion: semester,
      categorySuggestion: category,
      noticeTypeSuggestion: category === 'Timetable' ? 'Schedule' : 'Circular',
      prioritySuggestion: priority,
      targetTypeSuggestion: targetType,
      audienceSuggestion: targetType === 'UNIVERSITY' ? 'All University Students' : `${course} ${semester} Students`,
      keywords,
      confidence,
      model: 'demo-nlp-v1',
      provider: 'demo',
      status: confidence < 70 ? 'needs_review' : 'completed'
    }
  }

  async summarizeNotice(title = '', text = '') {
    const mainText = text || title
    return {
      overview: `This notice regarding "${title}" provides essential administrative/academic directives for students.`,
      keyPoints: [
        `Official announcement concerning ${title}.`,
        'Students are required to review the scheduled timelines and adhere strictly to guidelines.',
        'Contact department coordinators or check official portal for any discrepancies.'
      ],
      importantDate: 'Refer to original document for specific deadline dates.',
      actionRequired: 'Review details carefully and note down important deadlines.',
      category: title.toLowerCase().includes('exam') ? 'Examination' : 'Notice',
      priority: title.toLowerCase().includes('urgent') ? 'High' : 'Medium',
      provider: 'demo',
      model: 'demo-summarizer-v1',
      isDemo: true
    }
  }

  async extractImportantDate(text = '') {
    const dateRegex = /\b(\d{1,2}(st|nd|rd|th)?\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s*\d{0,4})\b/i
    const match = text.match(dateRegex)
    return match ? match[0] : null
  }

  async suggestAudience(title = '', text = '') {
    const analysis = await this.analyzeNotice(title, text)
    return {
      targetType: analysis.targetTypeSuggestion,
      audienceDescription: analysis.audienceSuggestion
    }
  }
}

module.exports = DemoAIProvider
