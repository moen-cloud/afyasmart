const CRITICAL_SYMPTOMS = [
  'chest pain', 'difficulty breathing', 'severe bleeding',
  'loss of consciousness', 'seizure', 'severe head injury',
  'stroke symptoms', 'severe allergic reaction', 'suicide thoughts'
];

const HIGH_RISK_SYMPTOMS = [
  'high fever', 'severe abdominal pain', 'persistent vomiting',
  'severe headache', 'confusion', 'severe pain',
  'blood in stool', 'blood in urine'
];

const MODERATE_SYMPTOMS = [
  'moderate fever', 'cough', 'body aches', 'fatigue',
  'nausea', 'diarrhea', 'moderate pain', 'rash', 'sore throat'
];

export const assessSymptoms = (symptoms, vitalSigns) => {
  let riskLevel = 'low';
  let urgency = 'routine';
  const recommendations = [];
  const possibleConditions = [];
  const immediateActions = [];

  const hasCriticalSymptoms = symptoms.some(symptom =>
    CRITICAL_SYMPTOMS.some(critical =>
      symptom.name.toLowerCase().includes(critical)
    ) || symptom.severity === 'severe'
  );

  if (hasCriticalSymptoms) {
    riskLevel = 'critical';
    urgency = 'emergency';
    recommendations.push('Seek immediate emergency medical attention');
    recommendations.push('Call emergency services or go to nearest ER');
    immediateActions.push('Call 911 or local emergency number');
    immediateActions.push('Do not drive yourself');
    return { riskLevel, urgency, recommendations, possibleConditions, immediateActions };
  }

  if (vitalSigns) {
    if (vitalSigns.temperature >= 103) {
      riskLevel = 'high';
      urgency = 'urgent';
      recommendations.push('High fever requires medical attention within 24 hours');
      possibleConditions.push('Severe infection');
    } else if (vitalSigns.temperature >= 100.4) {
      if (riskLevel === 'low') riskLevel = 'medium';
      recommendations.push('Monitor fever and stay hydrated');
    }

    if (vitalSigns.heartRate) {
      if (vitalSigns.heartRate > 120 || vitalSigns.heartRate < 50) {
        if (riskLevel === 'low' || riskLevel === 'medium') {
          riskLevel = 'high';
          urgency = 'urgent';
        }
        recommendations.push('Abnormal heart rate - seek medical attention');
      }
    }

    if (vitalSigns.bloodPressure) {
      const { systolic, diastolic } = vitalSigns.bloodPressure;
      if (systolic >= 180 || diastolic >= 120) {
        riskLevel = 'high';
        urgency = 'urgent';
        recommendations.push('Severely elevated blood pressure - seek immediate care');
        possibleConditions.push('Hypertensive crisis');
      }
    }

    if (vitalSigns.oxygenSaturation < 90) {
      riskLevel = 'high';
      urgency = 'urgent';
      recommendations.push('Low oxygen levels - seek immediate medical attention');
      possibleConditions.push('Respiratory distress');
    }
  }

  const hasHighRiskSymptoms = symptoms.some(symptom =>
    HIGH_RISK_SYMPTOMS.some(highRisk =>
      symptom.name.toLowerCase().includes(highRisk)
    )
  );

  if (hasHighRiskSymptoms && riskLevel === 'low') {
    riskLevel = 'high';
    urgency = 'urgent';
    recommendations.push('Your symptoms require prompt medical evaluation');
    recommendations.push('Schedule an appointment with a doctor today');
  }

  const hasModerateSymptoms = symptoms.some(symptom =>
    MODERATE_SYMPTOMS.some(moderate =>
      symptom.name.toLowerCase().includes(moderate)
    ) || symptom.severity === 'moderate'
  );

  if (hasModerateSymptoms && riskLevel === 'low') {
    riskLevel = 'medium';
    recommendations.push('Schedule a medical consultation within 2-3 days');
    recommendations.push('Monitor symptoms for any worsening');
  }

  symptoms.forEach(symptom => {
    const name = symptom.name.toLowerCase();
    
    if (name.includes('fever')) {
      recommendations.push('Stay hydrated and rest');
      possibleConditions.push('Infection', 'Viral illness');
    }
    
    if (name.includes('cough')) {
      recommendations.push('Stay hydrated');
      possibleConditions.push('Respiratory infection');
    }
  });

  if (recommendations.length === 0) {
    recommendations.push('Monitor your symptoms');
    recommendations.push('Rest and maintain good hydration');
    recommendations.push('Consult a doctor if symptoms worsen');
  }

  if (riskLevel === 'high') {
    immediateActions.push('Contact your doctor today');
    immediateActions.push('Monitor symptoms closely');
  } else if (riskLevel === 'medium') {
    immediateActions.push('Schedule a doctor appointment within 2-3 days');
  }

  return {
    riskLevel,
    urgency,
    recommendations: [...new Set(recommendations)],
    possibleConditions: [...new Set(possibleConditions)],
    immediateActions: [...new Set(immediateActions)]
  };
};