// //
// //
// // export interface SkillItem {
// //     id: number | string;
// //     personInfoId: null | number;
// //     personnelName: null | string ;
// //     position: string;
// //     requestDescription: string;
// //     inspectionId: string | number;
// //     orgSpecialityId: null | string | number;
// //     organizationUnitId: null | string | number;
// //     orgSpecialityName: string | null;
// //     organizationUnitName: string | null;
// //     personInfoName: string | null;
// //     personInfoFamily: string | null;
// //     personInfoPersonNumber: string | null;
// //     assignStatus?: 'pending' | 'assigned' | 'rejected' | 'accepted' | string;
// //     accepted?: boolean;
// //     [key: string]: any;
// // }
// //
// //
// // export interface ReviewAssignmentItem {
// //     id: number | string;
// //     reviewGroupId: number | null;
// //     reviewGroupName: string;
// //     personSpecialityId: number | null;
// //     [key: string]: any;
// // }
// //
// // // export interface SkillItem2 {
// // //   id: number | string;
// // //   orgSpecialityId: number | null;
// // //   orgSpecialityName: string | null;
// // //   organizationUnitId: number | null;
// // //   organizationUnitName: string | null;
// // //   personInfoId: number | null;
// // //   personInfoName: string | null;
// // //   personInfoFamily: string | null;
// // //   personInfoPersonNumber: string | null;
// // //   requestDescription: string;
// // //   position: string;
// // //   assignStatus?: 'pending' | 'assigned' | 'rejected' | 'accepted';
// // // }
// //
// // // interface SkillItem3 {
// // //   id: number | string;
// // //   orgSpecialityName: string;
// // //   organizationUnitName: string;
// // //   personInfoName: string;
// // //   personInfoFamily: string;
// // //   personInfoPersonNumber: string;
// // //   assignStatus: 'pending' | 'assigned' | 'rejected' | 'accepted';
// // //   accepted?: boolean;
// // //   requestDescription?: string;
// // //   [key: string]: any;
// // // }
// //
// //
// // export const inspection_status = {
// //     "not executed": "اجرا نشده",
// //     "under execution": "در حین اجرا",
// //     "executed": "اجرا شده",
// // }
// //
// // export const inspection_period = {
// //     "ONE_SEASON": "اول"
// // }
// //
// //
// // export  interface InspectionDetail {
// //     id: string;
// //     executionDate: number | null;
// //     season: string | null;
// //     status: string;
// //     annualPlanInspectionId: string;
// //     annualPlanInspectionName: string;
// //     forceOrganizationUnitId: string;
// //     forceOrganizationUnitName: string;
// //     organizationUnitId: string;
// //     organizationUnitCode: string;
// //     organizationUnitName: string;
// //     baseInspectionId: string;
// //     baseInspectionName: string;
// //     provinceName: string;
// //     provinceKey: string;
// //     locationName: string;
// //     locationKey: string;
// //     selectionOrgAndSeason: any;
// //     militaryKnowledgeGrade: any;
// //     shootingGrade: any;
// //     organizationNumber: any;
// //     bossFinalReport: any;
// //     staffOrgStatistics: any;
// //     dutyOrgStatistics: any;
// //     staffInventoryStatistics: any;
// //     dutyInventoryStatistics: any;
// //     bossPersonInfoId: any;
// //     bossPersonInfoPersonNumber: any;
// //     bossPersonInfoName: any;
// //     bossPersonInfoFamily: any;
// //     bossJob: any;
// //     parentInspectionId: string;
// //     childInspectionId: any;
// // }
// //
// // export interface Deficiency {
// //     id: string;
// //     title: string;
// //     description?: string;
// //     year?: number;
// //     status: string;
// //     deficiencyCode?: string;
// //     createdAt?: string;
// //     category?: string;
// //     severity?: 'low' | 'medium' | 'high';
// //     assignedTo?: string;
// //     deadline?: string;
// //     notes?: string;
// //     response?: {
// //         text: string;
// //         respondedAt: string;
// //         respondedBy: string;
// //         attachments: string[];
// //     };
// //     chatMessages?: ChatMessage[];
// // }
// //
// // export interface ChatMessage {
// //     id: string;
// //     text: string;
// //     sender: 'user' | 'inspector' | 'expert' | 'manager';
// //     senderName: string;
// //     senderRole?: string;
// //     timestamp: string;
// //     attachments?: string[];
// //     progressPercentage?: number;
// //     responseCode?: string;
// //     status?: string;
// // }
// //
// // export interface ResponseFormData {
// //     code: string;
// //     progressPercentage: number;
// //     responseText: string;
// //     attachments: string[];
// //     status: 'in_progress' | 'resolved' | 'rejected';
// // }
// //
// // export interface ApiResponse<T> {
// //     map(arg0: (d: any) => { id: any; text: any; notificationDate: any; inspectionId: any; status: "PENDING" | "IN_PROGRESS" | "DONE"; typeReport: any; }): Deficiency[];
// //     data: T;
// //     status: number;
// //     message: string;
// // }
// //
// // export interface PaginatedResponse<T> {
// //     rows: T[];
// //     count: number;
// //     currentPage: number;
// //     pageSize: number;
// //     totalPages: number;
// // }
// //
// //
// //
// //
// // export const mockDeficiencies: Deficiency[] = [
// //     {
// //         id: '1',
// //         title: 'نقص در سیستم اطفاء حریق ساختمان مرکزی',
// //         description: 'سیستم اطفاء حریق ساختمان مرکزی نیاز به بازرسی و تعمیر دارد. شیرهای اصلی دارای نشتی جزئی هستند و کپسول‌های آتش‌نشانی تاریخ مصرفشان گذشته است.',
// //         year: 1403,
// //         status: 'in_progress',
// //         deficiencyCode: 'DEF-FIRE-001',
// //         createdAt: '2024-03-15T10:30:00Z',
// //         category: 'امنیتی و ایمنی',
// //         severity: 'high',
// //         assignedTo: 'مهندس احمدی',
// //         deadline: '2024-06-30',
// //         notes: 'نیاز به بازدید فوری تیم فنی دارد',
// //         chatMessages: [
// //             {
// //                 id: 'msg1',
// //                 text: 'سیستم اطفاء حریق ساختمان مرکزی نیاز به بازرسی فوری دارد. شیرهای اصلی دارای نشتی هستند.',
// //                 sender: 'inspector',
// //                 senderName: ' بازرس',
// //                 senderRole: 'بازرس ارشد',
// //                 timestamp: '2024-03-15T10:30:00Z'
// //             },
// //             {
// //                 id: 'msg2',
// //                 text: 'پیگیری به مهندس احمدی محول شد. بازدید اولیه تا پایان هفته انجام می‌شود.',
// //                 sender: 'manager',
// //                 senderName: ' بازرس',
// //                 timestamp: '2024-03-16T14:20:00Z'
// //             },
// //
// //         ]
// //     },
// //     {
// //         id: '2',
// //         title: 'ضعف پوشش شبکه وایرلس در اتاق‌های اداری',
// //         description: 'در اتاق‌های ۳۰۱، ۳۰۲ و ۳۰۴ پوشش شبکه وایرلس ضعیف است که باعث اختلال در ارتباطات اینترنتی کارکنان می‌شود.',
// //         year: 1403,
// //         status: 'in_progress',
// //         deficiencyCode: 'DEF-NET-002',
// //         createdAt: '2024-03-10T14:20:00Z',
// //         category: 'فناوری اطلاعات',
// //         severity: 'medium',
// //         assignedTo: 'تیم شبکه',
// //         deadline: '2024-05-15',
// //         notes: 'نیاز به نصب اکسس پوینت اضافی در طبقه سوم'
// //     },
// //     {
// //         id: '3',
// //         title: 'خرابی سیستم تهویه مطبوع طبقه سوم',
// //         description: 'سیستم تهویه مطبوع طبقه سوم به طور کامل کار نمی‌کند. دمای محیط نامناسب است و نیاز به تعمیر اساسی دارد.',
// //         year: 1403,
// //         status: 'resolved',
// //         deficiencyCode: 'DEF-HVAC-003',
// //         createdAt: '2024-02-28T09:15:00Z',
// //         category: 'تاسیسات مکانیکی',
// //         severity: 'medium',
// //         assignedTo: 'تیم تاسیسات',
// //         deadline: '2024-04-30',
// //         notes: 'قطعات یدکی سفارش داده شده',
// //         response: {
// //             text: 'سیستم تعمیر و راه‌اندازی شد. دمای محیط به حالت نرمال بازگشته است.',
// //             respondedAt: '2024-04-25T11:00:00Z',
// //             respondedBy: 'مهندس تاسیسات',
// //             attachments: ['گزارش-تعمیرات.pdf', 'تاییدیه-ایمنی.jpg']
// //         },
// //         chatMessages: [
// //             {
// //                 id: 'msg1',
// //                 text: 'سیستم تهویه طبقه سوم کاملاً خراب است. دمای محیط نامناسب.',
// //                 sender: 'inspector',
// //                 senderName: 'بازرس رضایی',
// //                 timestamp: '2024-02-28T09:15:00Z'
// //             },
// //             {
// //                 id: 'msg2',
// //                 text: 'پیگیری شد. قطعات مورد نیاز سفارش داده شد.',
// //                 sender: 'user',
// //                 senderName: ' بازرس',
// //                 timestamp: '2024-03-05T16:30:00Z',
// //                 progressPercentage: 20
// //             },
// //             {
// //                 id: 'msg3',
// //                 text: 'قطعات دریافت و نصب شد. تست‌های اولیه موفقیت‌آمیز بود.',
// //                 sender: 'expert',
// //                 senderName: ' بازرس',
// //                 timestamp: '2024-04-20T10:45:00Z',
// //                 progressPercentage: 80
// //             },
// //             {
// //                 id: 'msg4',
// //                 text: 'تعمیرات تکمیل شد. سیستم به طور کامل راه‌اندازی شد.',
// //                 sender: 'expert',
// //                 senderName: ' بازرس',
// //                 timestamp: '2024-04-25T11:00:00Z',
// //                 progressPercentage: 100,
// //                 responseCode: 'RES-HVAC-003',
// //                 status: 'resolved'
// //             }
// //         ]
// //     },
// //     {
// //         id: '4',
// //         title: 'نقص در سیستم دوربین‌های نظارتی انبار',
// //         description: 'دوربین‌های نظارتی بخش انبار به درستی کار نمی‌کنند. دوربین‌های شماره ۳ و ۵ تصویر واضح ارائه نمی‌دهند.',
// //         year: 1403,
// //         status: 'in_progress',
// //         deficiencyCode: 'DEF-CCTV-004',
// //         createdAt: '2024-01-15T11:45:00Z',
// //         category: 'امنیتی',
// //         severity: 'high',
// //         assignedTo: 'تیم امنیت',
// //         deadline: '2024-03-31',
// //         notes: 'نیاز به تعویض دوربین‌های معیوب',
// //         response: {
// //             text: 'تمامی دوربین‌های معیوب تعویض شدند. سیستم به طور کامل راه‌اندازی شد.',
// //             respondedAt: '2024-03-20T16:30:00Z',
// //             respondedBy: 'مهندس کریمی',
// //             attachments: ['گزارش-تعمیرات.pdf', 'عکس-دوربین-جدید.jpg']
// //         }
// //     },
// //     {
// //         id: '5',
// //         title: 'عدم وجود علائم ایمنی کافی در راهروها',
// //         description: 'در راهروهای اصلی ساختمان علائم ایمنی و راهنمای خروج اضطراری کافی نصب نشده است.',
// //         year: 1403,
// //         status: 'rejected',
// //         deficiencyCode: 'DEF-SAFETY-005',
// //         createdAt: '2024-03-05T13:10:00Z',
// //         category: 'ایمنی',
// //         severity: 'low',
// //         assignedTo: 'تیم HSE',
// //         deadline: '2024-04-15',
// //         response: {
// //             text: 'بررسی شد. علائم ایمنی موجود کافی هستند.',
// //             respondedAt: '2024-04-10T10:15:00Z',
// //             respondedBy: 'کارشناس ایمنی',
// //             attachments: ['بررسی-علائم.pdf']
// //         }
// //     }
// // ];
// //
// //
// // export const inspectionPeriod: Record<string, string> = {
// //     ONE_SEASON: 'سه‌ماهه اول',
// //     TWO_SEASON: 'سه‌ماهه دوم',
// //     THREE_SEASON: 'سه‌ماهه سوم',
// //     FOUR_SEASON: 'سه‌ماهه چهارم',
// //     null: 'تعیین نشده',
// //     undefined: 'تعیین نشده',
// // };
// //
// // export  const deficiencyStatus: Record<string, string> = {
// //     executed:'تایید شده',
// //     PENDING: 'رد شده',
// //     IN_PROGRESS: 'در حال بررسی',
// //
// // };
// // export const deficiencyStatus2: Record<string, string> = {
// //     PENDING: 'رد شده',
// //     IN_PROGRESS: 'در حال بررسی',
// // };
// // deficiencyStatus2['on the execution'] = 'تایید شده';
// //
// // export   const  ReportType: Record<string, string> = {
// //     FLAW:'ناقص ',
// //     DEFICIENCY: 'عیب ',
// //     APPROVAL: 'مصوبه  ',
// //
// // };
// //
// // export interface Ticket {
// //     id: string;
// //     ticketNumber: string;
// //     title: string;
// //     description: string;
// //     deficiencyId?: string;
// //     annualPlanInspectionId: string;
// //     organizationUnitId: string;
// //     status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' | 'PENDING';
// //     priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
// //     category: 'DEFICIENCY' | 'FLAW' | 'APPROVAL' | 'GENERAL';
// //     createdBy: string;
// //     createdAt: string;
// //     updatedAt: string;
// //     assignedTo?: string;
// //     dueDate?: string;
// //     severity?: 'MINOR' | 'MAJOR' | 'CRITICAL';
// // }
// //
// // export interface TicketMessage {
// //     id: string;
// //     ticketId: string;
// //     content: string;
// //     senderId: string;
// //     senderName: string;
// //     senderType: 'USER' | 'INSPECTOR' | 'ADMIN' | 'SYSTEM';
// //     attachments: Array<{
// //         id: string;
// //         fileName: string;
// //         fileUrl: string;
// //         fileSize: number;
// //         mimeType: string;
// //     }>;
// //     internalNote?: string;
// //     isRead: boolean;
// //     readAt?: string;
// //     createdAt: string;
// // }
// //
// // export interface CreateTicketRequest {
// //     title: string;
// //     description: string;
// //     annualPlanInspectionId: string;
// //     organizationUnitId: string;
// //     deficiencyId?: string;
// //     priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
// //     category?: 'DEFICIENCY' | 'FLAW' | 'APPROVAL' | 'GENERAL';
// //     severity?: 'MINOR' | 'MAJOR' | 'CRITICAL';
// // }
// //
// // export interface SendMessageRequest {
// //     content: string;
// //     ticketId: string;
// //     attachments?: File[];
// //     internalNote?: string;
// // }
//
//
// export interface Deficiency {
//     id: string;
//     text: string;
//     notificationDate: number;
//     inspectionId: string;
//     status: 'PENDING' | 'IN_PROGRESS' | 'DONE';
//     typeReport: string | null;
//     stages?: Stage[];
//
// }
// export type StageStatus =
//     | "NOT_SENT"
//     | "PENDING"
//     | "APPROVED"
//     | "REJECTED";
//
// export interface Stage {
//     id?: string; // از API میاد
//     stageNumber: 1 | 2 | 3;
//     description: string;
//     progress: number;
//     status: StageStatus;
//     rejectReason?: string | null;
//     done?: boolean;
// }
//
// export interface Deficiency {
//     id: string;
//     text: string;
//     notificationDate: number;
//     inspectionId: string;
//     resolutionId: string;   // ✅ اضافه شد
//     title?: string;         // ✅ اگر لازم داری
//     status: 'PENDING' | 'IN_PROGRESS' | 'DONE';
//     typeReport: string | null;
//     stages?: Stage[];
// }
//
// export interface InspectionDetail {
//     id: string;
//     name: string;
//     // سایر فیلدهای inspection
// }
//
// export interface ApiResponse<T> {
//     data: T;
//     status: number;
//     message?: string;
// }
// export const inspectionPeriod: Record<string, string> = {
//     ONE_SEASON: 'سه‌ماهه اول',
//     TWO_SEASON: 'سه‌ماهه دوم',
//     THREE_SEASON: 'سه‌ماهه سوم',
//     FOUR_SEASON: 'سه‌ماهه چهارم',
//     null: 'تعیین نشده',
//     undefined: 'تعیین نشده',
// };
// modules/inspection-operation/followup/types.ts

export type StageStatus = "NOT_SENT" | "PENDING_APPROVAL" | "APPROVED" | "REJECTED";

export interface Stage {
    stageNumber: 1 | 2 | 3;           // مرحله ظاهری (1,2,3)
    responseNumber: 1 | 2 | 3 | 4 | 5 | 6;  // شماره واقعی response در API
    description: string;
    progress: number;
    status: StageStatus;
    rejectReason?: string | null;
}

// export interface Deficiency {
//     id: string;                         // همان resolutionId
//     text: string;
//     notificationDate: number;
//     inspectionId: string;
//     resolutionId: string;                // اضافه شد
//     status: 'PENDING' | 'IN_PROGRESS' | 'DONE';
//     typeReport: string | null;
//     stages: Stage[];                     // سه مرحله
// }

// در فایل Types.ts
export interface Deficiency {
    id: string;
    text: string;
    notificationDate: number | string; // تغییر به union type
    inspectionId: string;
    resolutionId: string;
    status: "DONE" | "IN_PROGRESS" | "PENDING";
    typeReport: string;
    stages: Stage[];
}

export interface InspectionDetail {
    id: string;
    name: string;
    executionDate?: number;
    season?: string;
    status?: string;
    inspectionYear: number;
    annualPlanInspectionName?: string;
    forceOrganizationUnitName?: string;
    organizationUnitName?: string;
    [key: string]: any;
}

export interface ResolutionResponse {
    id: string;
    response: string;
    progressPercentage: number;
    status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
    responseNumber: number;              // 1,2,3,4,5,6
    rejectedReason: string | null;
    resolutionId: string;
    reviewCustomizeQuestionId?: string;
    fileStorageRecordId?: string | null;
}

export interface ResolutionResponseApiResult {
    length: number;
    data: ResolutionResponse[];
    status: number;
    message: string;
}

export interface ApiResponse<T> {
    length: number;
    data: T;
    status: number;
    message?: string;
}

export const inspectionPeriod: Record<string, string> = {
    ONE_SEASON: 'سه‌ماهه اول',
    TWO_SEASON: 'سه‌ماهه دوم',
    THREE_SEASON: 'سه‌ماهه سوم',
    FOUR_SEASON: 'سه‌ماهه چهارم',
    null: 'تعیین نشده',
    undefined: 'تعیین نشده',
};