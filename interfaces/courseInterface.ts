interface Course {
    sections: [];
    lessonIds: [];
    subscribers: [];
    creationDate: string;
    _id: string;
    title: string;
    category: string;
    imageUrl: string;
    isPublic: boolean;
    authorName: string;
    authorImageUrl: string;
    authorId: string;
    popularity: number;
    sectionIds: [];
}

export default Course;