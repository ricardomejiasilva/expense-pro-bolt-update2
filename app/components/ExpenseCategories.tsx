import React from 'react';
import { useAppContext } from 'contexts/AppContext';

import { Category } from 'models/types';
import ExpenseCategoryItem from './ExpenseCategoryItem';

interface ExpenseCategoriesProps {
    selectedCategory: number | null;
    setSelectedCategory: (id: number) => void;
}

const ExpenseCategories: React.FC<ExpenseCategoriesProps> = ({
    selectedCategory,
    setSelectedCategory,
}) => {
    const { categoriesAndIcons } = useAppContext();

    const handlePress = (id: number) => {
        setSelectedCategory(id);
    };

    return (
        <>
            {categoriesAndIcons.map((item: Category, i: number) => (
                <ExpenseCategoryItem
                    key={i}
                    item={item}
                    selectedCategory={selectedCategory}
                    handlePress={handlePress}
                />
            ))}
        </>
    );
};

export default ExpenseCategories;
