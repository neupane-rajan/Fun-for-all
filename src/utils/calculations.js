export const calculatePercentage = (subjects) => {
  if (!subjects || subjects.length === 0) return 0;

  const totalObtained = subjects.reduce((sum, sub) => sum + (parseFloat(sub.obtained) || 0), 0);
  const totalMax = subjects.reduce((sum, sub) => sum + (parseFloat(sub.total) || 0), 0);

  if (totalMax === 0) return 0;
  return (totalObtained / totalMax) * 100;
};

export const getGrade = (percentage) => {
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B+';
  if (percentage >= 60) return 'B';
  if (percentage >= 50) return 'C';
  return 'F';
};

export const getGradeColor = (percentage) => {
  if (percentage >= 90) return 'text-green-500';
  if (percentage >= 80) return 'text-green-400';
  if (percentage >= 70) return 'text-blue-500';
  if (percentage >= 60) return 'text-blue-400';
  if (percentage >= 50) return 'text-yellow-500';
  return 'text-red-500';
};
