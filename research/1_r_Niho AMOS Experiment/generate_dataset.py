// ============================================================================
// REALISTIC SURVEY DATA GENERATOR
// Digital Transformation & Sustainability in Water Utilities
// ============================================================================

// Helper function: Weighted random selection
const weightedRandom = (items, weights) => {
  const rand = Math.random();
  let cumWeight = 0;
  for (let i = 0; i < items.length; i++) {
    cumWeight += weights[i];
    if (rand < cumWeight) return items[i];
  }
  return items[items.length - 1];
};

// Helper function: Generate Likert response with realistic distribution
const generateResponse = (baseMean, difficulty, personBias, stdDev = 0.9) => {
  const adjustedMean = baseMean + difficulty + personBias;
  const noise = (Math.random() - 0.5) * stdDev * 2;
  let response = Math.round(adjustedMean + noise);
  return Math.max(1, Math.min(5, response));
};

// Generate dataset
const data = [];
const numRespondents = 200;

for (let i = 0; i < numRespondents; i++) {
  const row = { ID: i + 1 };
  
  // ========== DEMOGRAPHICS (with logical constraints) ==========
  
  // Age distribution (realistic for workforce)
  row.Age = weightedRandom(
    ['<30', '30-39', '40-49', '50+'], 
    [0.15, 0.35, 0.35, 0.15]
  );
  
  // Experience based on age (logical combinations)
  if (row.Age === '<30') {
    row.Experience = weightedRandom(['<5', '5-9'], [0.7, 0.3]);
  } else if (row.Age === '30-39') {
    row.Experience = weightedRandom(['<5', '5-9', '10-14'], [0.25, 0.45, 0.30]);
  } else if (row.Age === '40-49') {
    row.Experience = weightedRandom(['5-9', '10-14', '15+'], [0.15, 0.45, 0.40]);
  } else { // 50+
    row.Experience = weightedRandom(['10-14', '15+'], [0.25, 0.75]);
  }
  
  // Education distribution
  row.Education = weightedRandom(
    ['Bachelor', 'High Diploma', 'Master', 'PhD'], 
    [0.45, 0.20, 0.28, 0.07]
  );
  
  // Management level based on experience
  const expNum = row.Experience === '<5' ? 3 : 
                 row.Experience === '5-9' ? 7 : 
                 row.Experience === '10-14' ? 12 : 18;
  
  if (expNum < 5) {
    row.Managerial = 'Operational';
  } else if (expNum < 10) {
    row.Managerial = weightedRandom(['Operational', 'Functional'], [0.65, 0.35]);
  } else if (expNum < 15) {
    row.Managerial = weightedRandom(['Operational', 'Functional', 'Top'], [0.30, 0.50, 0.20]);
  } else {
    row.Managerial = weightedRandom(['Operational', 'Functional', 'Top'], [0.15, 0.45, 0.40]);
  }
  
  // Gender (engineering sector typically male-dominated)
  row.Sex = weightedRandom(['Male', 'Female'], [0.65, 0.35]);
  
  // ========== RESPONSE PATTERNS ==========
  
  // Person-level bias: some people tend to agree/disagree more
  const personBias = (Math.random() - 0.5) * 1.0;
  
  // Dimension-level correlation: responses within a dimension correlate
  const dimBias = (Math.random() - 0.5) * 0.6;
  
  // ========== DIGITAL STRATEGY (Mean ~3.7) ==========
  ['Strategy_Q1', 'Strategy_Q2', 'Strategy_Q3', 'Strategy_Q4', 'Strategy_Q5'].forEach((item, idx) => {
    const difficulties = [0.0, -0.1, 0.1, -0.2, 0.0]; // Item difficulty adjustments
    row[item] = Math.random() < 0.03 ? null : // 3% missing values
                generateResponse(3.7, difficulties[idx], personBias + dimBias);
  });
  
  // ========== CULTURE (Mean ~3.6) ==========
  ['Culture_Q6', 'Culture_Q7', 'Culture_Q8', 'Culture_Q9', 'Culture_Q10'].forEach((item, idx) => {
    const difficulties = [0.1, 0.0, -0.1, 0.0, 0.1];
    row[item] = Math.random() < 0.03 ? null : 
                generateResponse(3.6, difficulties[idx], personBias + dimBias);
  });
  
  // ========== TECH INFRASTRUCTURE (Mean ~3.3, more challenging) ==========
  ['Tech_Q11', 'Tech_Q12', 'Tech_Q13', 'Tech_Q14', 'Tech_Q15', 'Tech_Q16', 'Tech_Q17'].forEach((item, idx) => {
    const difficulties = [0.0, 0.2, -0.1, -0.5, -0.4, 0.1, -0.2]; // Smart meters harder
    row[item] = Math.random() < 0.03 ? null : 
                generateResponse(3.3, difficulties[idx], personBias + dimBias);
  });
  
  // ========== ECONOMIC SUSTAINABILITY (Mean ~3.5) ==========
  ['Econ_Q19', 'Econ_Q20', 'Econ_Q21', 'Econ_Q22', 'Econ_Q23'].forEach((item, idx) => {
    const difficulties = [-0.3, -0.2, -0.3, 0.1, 0.0]; // NRW reduction harder
    row[item] = Math.random() < 0.03 ? null : 
                generateResponse(3.5, difficulties[idx], personBias + dimBias);
  });
  
  // ========== SOCIAL SUSTAINABILITY (Mean ~3.8, generally positive) ==========
  ['Social_Q24', 'Social_Q25', 'Social_Q26', 'Social_Q27', 'Social_Q28', 'Social_Q29'].forEach((item, idx) => {
    const difficulties = [0.2, -0.2, 0.3, 0.0, 0.1, 0.0]; // Water quality high priority
    row[item] = Math.random() < 0.03 ? null : 
                generateResponse(3.8, difficulties[idx], personBias + dimBias);
  });
  
  // ========== ENVIRONMENTAL SUSTAINABILITY (Mean ~3.4) ==========
  ['Env_Q30', 'Env_Q31', 'Env_Q32', 'Env_Q33', 'Env_Q34', 'Env_Q35'].forEach((item, idx) => {
    const difficulties = [0.1, -0.2, -0.4, -0.3, 0.2, -0.1]; // Renewable energy harder
    row[item] = Math.random() < 0.03 ? null : 
                generateResponse(3.4, difficulties[idx], personBias + dimBias);
  });
  
  data.push(row);
}

// ============================================================================
// EXPORT TO CSV
// ============================================================================

// Create CSV headers
const headers = Object.keys(data[0]);
const csvRows = [headers.join(',')];

// Add data rows
data.forEach(row => {
  const values = headers.map(header => {
    const value = row[header];
    return value === null ? '' : value;
  });
  csvRows.push(values.join(','));
});

const csvContent = csvRows.join('\n');

// Output or save
console.log(csvContent);

// For Node.js, save to file:
// const fs = require('fs');
// fs.writeFileSync('realistic_survey_data.csv', csvContent);

// For browser, download:
// const blob = new Blob([csvContent], { type: 'text/csv' });
// const url = URL.createObjectURL(blob);
// const a = document.createElement('a');
// a.href = url;
// a.download = 'realistic_survey_data.csv';
// a.click();
