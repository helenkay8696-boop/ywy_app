const MockData = {
    user: {
        phone: '13800000000',
        name: '张三',
        avatar: 'images/avatar.png',
        isLoggedIn: false,
        idStatus: '已认证',
        companyStatus: '已验证',
        idName: '张三',
        idNumber: '440****************123',
        companyName: '丰源物流有限公司',
        companyCode: '91440101XXXXXXXX',
        balance: 500.00,
        transactions: [
            { id: 1, amount: -2000.00, type: 'expense', label: '余额提现', date: '2026-01-04' },
            { id: 2, amount: 1000.00, type: 'income', label: '账户充值', date: '2026-01-04' },
            { id: 3, amount: -500.00, type: 'expense', label: '余额提现', date: '2026-01-04' },
            { id: 4, amount: 100.00, type: 'income', label: '账户充值', date: '2026-01-04' },
            { id: 5, amount: -100.00, type: 'expense', label: '余额提现', date: '2026-01-04' },
            { id: 6, amount: 1000.00, type: 'income', label: '账户充值', date: '2026-01-04' },
            { id: 7, amount: 1000.00, type: 'income', label: '账户充值', date: '2026-01-04' },
            { id: 8, amount: -8000.00, type: 'expense', label: '余额提现', date: '2026-01-04' },
            { id: 9, amount: 5000.00, type: 'income', label: '账户充值', date: '2026-01-04' }
        ],
        bankCards: [
            { id: 1, bankName: '中国建设银行', cardType: '储蓄卡', cardNumber: '6889' }
        ]
    },
    stats: {
        cargoCount: 12,
        orderCount: 45,
        paymentDue: 15800.00
    },
    waybills: [
        {
            id: 'WB20231223001',
            status: '运输中',
            origin: '上海市',
            destination: '北京市',
            cargo: '电子配件',
            weight: '5吨',
            driver: '李师傅',
            plate: '沪A·88888',
            date: '2023-12-23',
            price: 2000.00
        },
        {
            id: 'WB20231222005',
            status: '待装货',
            origin: '苏州市',
            destination: '杭州市',
            cargo: '家具',
            weight: '2.5吨',
            driver: '王师傅',
            plate: '苏E·66666',
            date: '2023-12-22',
            price: 1500.00
        },
        {
            id: 'WB20231220002',
            status: '已签收',
            origin: '广州市',
            destination: '深圳市',
            cargo: '布料',
            weight: '8吨',
            driver: '张师傅',
            plate: '粤A·12345',
            date: '2023-12-20',
            price: 3000.00
        },
        {
            id: 'WB20240101001',
            status: '未接单',
            origin: '深圳市',
            destination: '东莞市',
            cargo: '塑料制品',
            weight: '3吨',
            driver: '',
            plate: '',
            date: '2024-01-01',
            price: 1200.00
        },
        {
            id: 'WB20240102002',
            status: '已接单',
            origin: '珠海市',
            destination: '中山市',
            cargo: '五金配件',
            weight: '1.5吨',
            driver: '赵师傅',
            plate: '粤C·99999',
            date: '2024-01-02',
            price: 800.00
        },
        {
            id: 'WB20240103003',
            status: '已回单',
            origin: '佛山市',
            destination: '肇庆市',
            cargo: '陶瓷',
            weight: '10吨',
            driver: '孙师傅',
            plate: '粤E·55555',
            date: '2024-01-03',
            price: 4500.00
        },
        {
            id: 'WB20240104004',
            status: '已结算',
            origin: '惠州市',
            destination: '河源市',
            cargo: '电子产品',
            weight: '2吨',
            driver: '周师傅',
            plate: '粤L·77777',
            date: '2024-01-04',
            price: 900.00
        },
        {
            id: 'WB20240105005',
            status: '已取消',
            origin: '江门市',
            destination: '阳江市',
            cargo: '海鲜',
            weight: '1吨',
            driver: '',
            plate: '',
            date: '2024-01-05',
            price: 500.00
        }
    ],
    statements: [
        {
            id: 'ST202311',
            month: '2023年11月',
            amount: 25600.00,
            status: '已结清'
        },
        {
            id: 'ST202312',
            month: '2023年12月',
            amount: 15800.00,
            status: '未结清'
        }
    ],
    messages: [
        {
            id: 'MSG001',
            type: '装货预警',
            title: '装货即将延迟',
            content: '您的运单 WB20231223001 距离预约装货时间仅剩1小时，请关注司机定位。',
            time: '2023-12-24 10:00',
            isRead: false
        },
        {
            id: 'MSG002',
            type: '异常通知',
            title: '路况异常预警',
            content: '运单 WB20231222005 所经地段因大雾拥堵，预计达到时间将推迟2小时。',
            time: '2023-12-24 09:30',
            isRead: true
        },
        {
            id: 'MSG003',
            type: '卸货预警',
            title: '即将抵达目的地',
            content: '运单 WB20231220002 司机已距离卸货地 5km，请提前做好接货准备。',
            time: '2023-12-24 08:45',
            isRead: true
        }
    ],
    frequentRoutes: [
        {
            id: 'FR001',
            origin: '深圳市',
            destination: '广州市',
            cargoName: '电子配件',
            vehicleDisplay: '4.2米 厢式货车',
            frequency: 15
        },
        {
            id: 'FR002',
            origin: '东莞市',
            destination: '惠州市',
            cargoName: '塑胶原料',
            vehicleDisplay: '9.6米 高栏车',
            frequency: 8
        },
        {
            id: 'FR003',
            origin: '佛山市',
            destination: '中山市',
            cargoName: '家电配件',
            vehicleDisplay: '7.6米 厢式货车',
            frequency: 5
        }
    ],
    addressBook: [
        { name: '王小明', phone: '13812345678', city: '深圳市 龙华区', detail: '民治大道100号' },
        { name: '李四', phone: '13987654321', city: '广州市 天河区', detail: '珠江新城华夏路10号' },
        { name: '赵六', phone: '13611112222', city: '东莞市 南城区', detail: '鸿福路200号' }
    ]
};
