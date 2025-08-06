'use client';
import { faker } from '@faker-js/faker';
import {
  KanbanBoard,
  KanbanCard,
  KanbanCards,
  KanbanHeader,
  KanbanProvider,
} from '@/components/ui/shadcn-io/kanban';
import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

// Generate data inside the component to avoid hydration issues
const generateColumns = () => [
  { id: 'col-1', name: 'Chờ Xử Lý', color: '#6B7280' }, // To Do - Gray
  { id: 'col-2', name: 'Đang Thực Hiện', color: '#0ea5e9' }, // In Progress - Blue (matching your chart colors)
  { id: 'col-3', name: 'Hoàn Thành', color: '#10B981' }, // Finished - Green
];

const generateUsers = () => {
  // Seed faker to ensure consistent data between server and client
  faker.seed(123);
  return Array.from({ length: 4 })
    .fill(null)
    .map((_, index) => ({
      id: `user-${index + 1}`,
      name: faker.person.fullName(),
      image: faker.image.avatar(),
    }));
};

const generateFeatures = (columns: any[], users: any[]) => {
  // Seed faker to ensure consistent data
  faker.seed(456);
  return Array.from({ length: 20 })
    .fill(null)
    .map((_, index) => ({
      id: `feature-${index + 1}`,
      name: capitalize(faker.company.buzzPhrase()),
      startAt: faker.date.past({ years: 0.5, refDate: new Date('2024-08-06') }),
      endAt: faker.date.future({ years: 0.5, refDate: new Date('2024-08-06') }),
      column: faker.helpers.arrayElement(columns).id,
      owner: faker.helpers.arrayElement(users),
    }));
};
const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});
const shortDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
});

const KanbanPage = () => {
  const [columns, setColumns] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [features, setFeatures] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Generate data on client side only to avoid hydration issues
    const generatedColumns = generateColumns();
    const generatedUsers = generateUsers();
    const generatedFeatures = generateFeatures(generatedColumns, generatedUsers);

    setColumns(generatedColumns);
    setUsers(generatedUsers);
    setFeatures(generatedFeatures);
    setIsLoaded(true);
  }, []);

  // Return loading state until data is generated on client
  if (!isLoaded) {
    return (
      <div className="m-2 my-1.5 px-4 py-3 bg-white rounded-[10px] shadow">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-muted-foreground">Đang tải...</div>
        </div>
      </div>
    );
  }
  return (
    <div className="m-2 my-1.5 p-4 bg-white rounded-[10px] shadow">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground mb-2">Bảng Kanban Quy Trình</h1>
        <p className="text-muted-foreground">Quản lý và theo dõi tiến độ các công việc</p>
      </div>
      <div className="flex gap-6 overflow-x-auto pb-4">
        <KanbanProvider
          columns={columns}
          data={features}
          onDataChange={setFeatures}
        >
          {(column: any) => (
            <div key={column.id} className="min-w-[320px]">
              <KanbanBoard id={column.id}>
                <KanbanHeader>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-t-lg border-b">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: column.color as string }}
                      />
                      <span className="font-medium text-foreground">{column.name}</span>
                    </div>
                    <div className="text-sm text-muted-foreground bg-white px-2 py-1 rounded-md border">
                      {features.filter((f: any) => f.column === column.id).length}
                    </div>
                  </div>
                </KanbanHeader>
                <KanbanCards id={column.id}>
                  {(feature: (typeof features)[number]) => (
                    <KanbanCard
                      column={column.id}
                      id={feature.id}
                      key={feature.id}
                      name={feature.name}
                    >
                      <div className="p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex flex-col gap-2 flex-1">
                            <h4 className="font-medium text-sm text-foreground leading-tight">
                              {feature.name}
                            </h4>
                          </div>
                          {feature.owner && (
                            <Avatar className="h-6 w-6 shrink-0">
                              <AvatarImage src={feature.owner.image} />
                              <AvatarFallback className="text-xs bg-primary/10 text-primary border">
                                {feature.owner.name?.slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>
                            {shortDateFormatter.format(feature.startAt)}
                          </span>
                          <span>-</span>
                          <span>
                            {dateFormatter.format(feature.endAt)}
                          </span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <div className="h-2 w-2 rounded-full bg-green-500"></div>
                              <span>Đang hoạt động</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </KanbanCard>
                  )}
                </KanbanCards>
              </KanbanBoard>
            </div>
          )}
        </KanbanProvider>
      </div>
    </div>
  );
};
export default KanbanPage;
