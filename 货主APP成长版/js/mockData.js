const MockData = {
    user: {
        phone: '13800000000',
        name: '张三',
        avatar: 'https://via.placeholder.com/100',
        isLoggedIn: false
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
            origin: '上海市·浦东新区',
            destination: '北京市·朝阳区',
            cargo: '电子配件',
            weight: '5吨',
            driver: '李师傅',
            plate: '沪A·88888',
            date: '2023-12-23'
        },
        {
            id: 'WB20231222005',
            status: '待装货',
            origin: '苏州市·吴中区',
            destination: '杭州市·西湖区',
            cargo: '家具',
            weight: '2.5吨',
            driver: '王师傅',
            plate: '苏E·66666',
            date: '2023-12-22'
        },
        {
            id: 'WB20231220002',
            status: '已签收',
            origin: '广州市·白云区',
            destination: '深圳市·南山区',
            cargo: '布料',
            weight: '8吨',
            driver: '张师傅',
            plate: '粤A·12345',
            date: '2023-12-20'
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
    ]
};
