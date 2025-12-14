
export const calculateTotalPoint = (pointHistory = []) => {
    return pointHistory.reduce((total, item) => {
        return total + (item.amount || 0)
    }, 0)
}

export const getUserRank = (resellers, userId) => {
    if (!resellers.length) return "-";

    const sorted = [...resellers].sort(
        (a, b) => b.totalPoints - a.totalPoints
    );

    console.table(sorted);

    const index = sorted.findIndex(r => r.id === userId);
    return index === -1 ? "-" : index + 1;
};

