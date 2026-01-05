class App {
    constructor() {
        this.currentView = 'login';
        this.nav = document.getElementById('bottom-nav');
        this.main = document.getElementById('main-view');

        this.shipForm = {
            vehicleLength: '5',
            vehicleType: '普通货车',
            invoiceType: '不开发票',
            notes: ['无需司机装卸'],
            pricingOption: '整车发货',
            cargoName: '配件零件',
            packaging: '吨包',
            weight: '',
            volume: '',
            isKg: false,
            dimensions: { l: '', w: '', h: '' },
            loadAddr: { city: '深圳市 龙华区', name: '利金城科技工业园', detail: '吉华路58号', contactName: '张发发', contactPhone: '13888888888' },
            unloadAddr: { city: '深圳市 龙岗区', name: '金荣达荣寓', detail: '坂田街道', contactName: '李收收', contactPhone: '13999999999' },
            pickupTime: '明天 晚上18:00-21:00',
            deliveryTime: '请填写',
            serviceType: '标准达'
        };

        this.init();

        // Wallet visibility
        this.isBalanceVisible = false;

        // Initialize balance from storage
        const storedBalance = localStorage.getItem('cargoUserBalance');
        if (storedBalance) {
            MockData.user.balance = parseFloat(storedBalance);
        }

        // Initialize transactions from storage
        const storedTransactions = localStorage.getItem('cargoUserTransactions');
        if (storedTransactions) {
            try {
                MockData.user.transactions = JSON.parse(storedTransactions);
            } catch (e) {
                console.error('Failed to parse transactions', e);
            }
        }

        // Initialize bank cards from storage
        const storedBankCards = localStorage.getItem('cargoUserBankCards');
        if (storedBankCards) {
            try {
                MockData.user.bankCards = JSON.parse(storedBankCards);
            } catch (e) {
                console.error('Failed to parse bank cards', e);
            }
        }
    }

    init() {
        this.setupNavigation();
        this.checkLoginStatus();
    }

    setupNavigation() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const target = e.currentTarget.dataset.target;
                this.navigate(target);
            });
        });
    }

    checkLoginStatus() {
        if (!MockData.user.isLoggedIn) {
            this.renderLogin();
        } else {
            this.navigate('ship');
        }
    }

    navigate(viewId, params = {}) {
        this.currentView = viewId;
        this.currentParams = params;

        // Update nav active state
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.target === viewId);
        });

        // Show/Hide Nav based on view
        const mainTabs = ['ship', 'waybills', 'statements', 'profile', 'home'];
        // Update to include new sub-views if needed, essentially logic is: show nav only on mainTabs
        if (mainTabs.includes(viewId)) {
            this.nav.classList.remove('hidden');
        } else {
            this.nav.classList.add('hidden');
        }

        this.renderView(viewId, params);
    }

    renderView(viewId, params) {
        this.main.innerHTML = '';
        switch (viewId) {
            case 'login': this.renderLogin(); break;
            case 'register': this.renderRegister(); break;
            case 'home': this.renderShip(); break;
            case 'ship': this.renderShip(); break;
            case 'waybills': this.renderWaybills(); break;
            case 'waybillDetail': this.renderWaybillDetail(params); break;
            case 'statements': this.renderStatements(); break;
            case 'profile': this.renderProfile(); break;
            case 'messages': this.renderMessages(); break;
            case 'profileEdit': this.renderProfileEdit(); break;
            case 'identityVerify': this.renderIdentityVerify(); break;
            case 'enterpriseAuth': this.renderEnterpriseAuth(); break;
            case 'starRatingDetail': this.renderStarRatingDetail(); break;
            case 'walletDetail': this.renderWalletDetail(); break;
            case 'bankCards': this.renderBankCards(); break;
            case 'addBankCard': this.renderAddBankCard(); break;
            case 'addressPicker': this.renderAddressPicker(params.type); break;
            case 'mapPicker': this.renderMapPicker(params.type); break;
            case 'timePicker': this.renderTimePicker(params.type); break;
            case 'cargoInfo': this.renderCargoInfo(); break;
            case 'vehicleSelection': this.renderVehicleSelection(); break;
            case 'frequentRoutes': this.renderFrequentRoutes(); break;
            default: this.renderShip();
        }
    }

    // --- Views ---

    renderLogin() {
        this.main.innerHTML = `
            <div class="container" style="height: 100vh; display: flex; flex-direction: column; justify-content: center;">
                <h1 class="text-center mb-4" style="color: var(--primary-color); font-size: 24px;">货主版APP</h1>
                <div class="card">
                    <h2 class="text-center" style="font-size: 18px; margin-bottom: 20px;">欢迎登录</h2>
                    <div class="form-group">
                        <label class="form-label">手机号</label>
                        <input type="tel" class="form-input" placeholder="请输入手机号" value="13800000000">
                    </div>
                    <div class="form-group">
                    <label class="form-label">验证码</label>
                    <div style="display: flex; gap: 8px;">
                        <input type="text" class="form-input" placeholder="请输入验证码" value="1234">
                        <button class="btn btn-primary" style="flex: 0 0 100px; padding: 0; font-size: 13px; height: 48px; border-radius: 24px;">获取验证码</button>
                    </div>
                </div>
                    <button class="btn btn-primary" id="login-btn">登录</button>
                    <div style="text-align: center; margin-top: 20px;">
                        <span style="color: var(--text-secondary); font-size: 12px;">没有账号？</span>
                        <span id="to-register-btn" style="color: var(--primary-color); font-size: 12px; cursor: pointer;">立即注册</span>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('login-btn').addEventListener('click', () => {
            MockData.user.isLoggedIn = true;
            this.navigate('ship');
        });

        document.getElementById('to-register-btn').addEventListener('click', () => {
            this.navigate('register');
        });
    }

    renderRegister() {
        this.main.innerHTML = `
            <div class="bg-light" style="min-height: 100%; display: flex; flex-direction: column;">
                <header style="padding: 12px 16px; display: flex; align-items: center;">
                    <span class="material-icons" id="reg-back-btn" style="cursor: pointer; color: var(--text-secondary);">arrow_back</span>
                </header>
                
                <div class="container" style="flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 0 32px;">
                    <div style="margin-bottom: 40px; text-align: left;">
                        <h2 style="font-size: 28px; margin: 0 0 8px 0; color: var(--text-main);">新用户注册</h2>
                        <p style="color: var(--text-secondary); margin: 0; font-size: 14px;">简单几步，开启便捷发货体验</p>
                    </div>

                    <div class="form-group" style="margin-bottom: 24px;">
                        <div style="position: relative;">
                            <span class="material-icons" style="position: absolute; left: 0; top: 12px; color: #ccc; font-size: 20px;">smartphone</span>
                            <input type="tel" class="form-input" id="reg-phone" placeholder="请输入手机号" style="border: none; border-bottom: 1px solid #eee; border-radius: 0; padding: 12px 0 12px 32px; background: transparent; font-size: 16px;">
                        </div>
                    </div>

                    <div class="form-group" style="margin-bottom: 24px;">
                        <div style="display: flex; align-items: center; position: relative;">
                            <span class="material-icons" style="position: absolute; left: 0; top: 12px; color: #ccc; font-size: 20px;">verified</span>
                            <input type="text" class="form-input" placeholder="请输入验证码" style="border: none; border-bottom: 1px solid #eee; border-radius: 0; padding: 12px 0 12px 32px; background: transparent; font-size: 16px; flex: 1;">
                            <button id="send-code-btn" style="background: none; border: none; color: var(--primary-color); font-size: 14px; font-weight: 500; cursor: pointer;">获取验证码</button>
                        </div>
                    </div>

                    <div style="margin: 20px 0 32px; font-size: 12px; color: var(--text-secondary); line-height: 1.6;">
                        注册或登录即代表您已阅读并同意 <span style="color: var(--primary-color);">《用户服务协议》</span> 与 <span style="color: var(--primary-color);">《隐私政策》</span>
                    </div>

                    <button class="btn btn-primary" id="register-btn" style="height: 50px; font-size: 16px; border-radius: 25px; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);">注册并登录</button>
                    
                    <div style="text-align: center; margin-top: 32px;">
                        <span style="color: var(--text-secondary); font-size: 14px;">已有账号？</span>
                        <span id="to-login-btn" style="color: var(--primary-color); font-size: 14px; font-weight: 500; cursor: pointer;">立即登录</span>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('reg-back-btn').onclick = () => this.navigate('login');
        document.getElementById('to-login-btn').onclick = () => this.navigate('login');

        const regBtn = document.getElementById('register-btn');
        regBtn.onclick = () => {
            const phone = document.getElementById('reg-phone').value;
            if (!phone) {
                alert('请输入手机号');
                return;
            }
            MockData.user.isLoggedIn = true;
            MockData.user.phone = phone;
            this.navigate('home');
        };

        const codeBtn = document.getElementById('send-code-btn');
        codeBtn.onclick = () => {
            codeBtn.innerText = '已发送(60s)';
            codeBtn.style.color = '#999';
            codeBtn.disabled = true;
        };
    }


    renderMessages() {
        this.main.innerHTML = `
            <div class="bg-light" style="min-height: 100%; padding-bottom: 0;">
                <header style="background: white; padding: 12px 16px; border-bottom: 1px solid var(--border-color); display: flex; align-items: center; gap: 12px; position: sticky; top: 0; z-index: 100;">
                    <span class="material-icons" onclick="app.navigate('profile')" style="cursor: pointer; color: var(--text-main);">arrow_back</span>
                    <h2 style="font-size: 18px; margin: 0; font-weight: bold;">我的消息</h2>
                </header>
                
                <div class="container" style="padding-top: 16px;">
                    <!-- Message Cards (Image Design) -->
                    <div class="card" style="padding: 16px; margin-bottom: 16px; border-radius: 16px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <div style="width: 24px; height: 24px; background: #FFF7E6; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                    <span class="material-icons" style="font-size: 16px; color: #FFA940;">info</span>
                                </div>
                                <span style="font-size: 15px; font-weight: bold; color: #333;">装货预警</span>
                            </div>
                            <div style="display: flex; align-items: center; gap: 4px;">
                                <span style="font-size: 12px; color: #999;">2023-12-24 10:00</span>
                                <div style="width: 6px; height: 6px; background: #FF4D4F; border-radius: 50%;"></div>
                            </div>
                        </div>
                        <div style="font-size: 16px; font-weight: bold; color: #333; margin-bottom: 8px;">装货即将延迟</div>
                        <div style="font-size: 13px; color: #666; line-height: 1.5;">您的运单 WB20231223001 距离预约装货时间仅剩1小时，请关注司机定位。</div>
                    </div>

                    <div class="card" style="padding: 16px; margin-bottom: 16px; border-radius: 16px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <div style="width: 24px; height: 24px; background: #FFF1F0; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                    <span class="material-icons" style="font-size: 16px; color: #FF4D4F;">error</span>
                                </div>
                                <span style="font-size: 15px; font-weight: bold; color: #333;">异常通知</span>
                            </div>
                            <span style="font-size: 12px; color: #999;">2023-12-24 09:30</span>
                        </div>
                        <div style="font-size: 16px; font-weight: bold; color: #333; margin-bottom: 8px;">路况异常预警</div>
                        <div style="font-size: 13px; color: #666; line-height: 1.5;">运单 WB20231222005 所经地段因大雾拥堵，预计到达时间将推迟2小时。</div>
                    </div>

                    <div class="card" style="padding: 16px; margin-bottom: 16px; border-radius: 16px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <div style="width: 24px; height: 24px; background: #F6FFED; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                    <span class="material-icons" style="font-size: 16px; color: #52C41A;">check_circle</span>
                                </div>
                                <span style="font-size: 15px; font-weight: bold; color: #333;">卸货预警</span>
                            </div>
                            <span style="font-size: 12px; color: #999;">2023-12-24 08:45</span>
                        </div>
                        <div style="font-size: 16px; font-weight: bold; color: #333; margin-bottom: 8px;">即将抵达目的地</div>
                        <div style="font-size: 13px; color: #666; line-height: 1.5;">运单 WB20231220002 司机已距离卸货地 5km，请提前做好接货准备。</div>
                    </div>
                </div>
            </div>
        `;
    }

    getMessageColor(type) {
        switch (type) {
            case '装货预警': return '#F59E0B'; // Orange
            case '卸货预警': return '#10B981'; // Green
            case '异常通知': return '#EF4444'; // Red
            default: return 'var(--primary-color)';
        }
    }

    renderShip() {
        const form = this.shipForm;
        this.main.innerHTML = `
            <div class="bg-light" style="min-height: 100%; padding-bottom: 0;">
                <div style="background: white; padding: 12px 16px; border-bottom: 1px solid var(--border-color); display: flex; align-items: center; position: relative;">
                    <h2 style="font-size: 18px; margin: 0 auto; font-weight: bold;">发布货源</h2>
                    <div style="position: absolute; right: 16px; width: 36px; height: 36px; background: #fff; border-radius: 50%; box-shadow: 0 2px 8px rgba(0,0,0,0.05); display: flex; align-items: center; justify-content: center; cursor: pointer;" onclick="app.navigate('messages')">
                        <span class="material-icons" style="color: #666; font-size: 22px;">notifications</span>
                        <div style="position: absolute; top: 6px; right: 6px; width: 8px; height: 8px; background: #FF4D4F; border-radius: 50%; border: 1.5px solid white;"></div>
                    </div>
                </div>

                <div class="container" style="padding-top: 16px;">
                    <!-- Today's To-Do Stats Card (Image 1 Style) -->
                    <div class="card" style="background: var(--primary-color); color: white; padding: 20px; margin-bottom: 20px; border-radius: 16px;">
                        <div style="font-size: 15px; margin-bottom: 20px; font-weight: 500;">今日待办</div>
                        <div style="display: flex; justify-content: space-between; text-align: center;">
                            <div style="flex: 1;">
                                <div style="font-size: 28px; font-weight: bold; margin-bottom: 8px;">12</div>
                                <div style="font-size: 13px; opacity: 0.9;">待发货</div>
                            </div>
                            <div style="flex: 1;">
                                <div style="font-size: 28px; font-weight: bold; margin-bottom: 8px;">45</div>
                                <div style="font-size: 13px; opacity: 0.9;">在途运单</div>
                            </div>
                            <div style="flex: 1;">
                                <div style="font-size: 28px; font-weight: bold; margin-bottom: 8px;">15800</div>
                                <div style="font-size: 13px; opacity: 0.9;">待付运费</div>
                            </div>
                        </div>
                    </div>




                    <div class="addr-card">
                        <div class="addr-row" id="load-addr-trigger" style="cursor: pointer;">
                            <div class="addr-icon load">装</div>
                            <div class="addr-info">
                                <div class="addr-title">${form.loadAddr.city}</div>
                                <div class="addr-sub">${form.loadAddr.name} ${form.loadAddr.detail} · ${form.loadAddr.contactName} ${form.loadAddr.contactPhone}</div>
                            </div>
                            <span class="material-icons" style="color: #ccc;">chevron_right</span>
                        </div>
                        <div style="height: 1px; background: #eee; margin-left: 36px;"></div>
                        <div class="addr-row" id="unload-addr-trigger" style="cursor: pointer;">
                            <div class="addr-icon unload">卸</div>
                            <div class="addr-info">
                                <div class="addr-title">${form.unloadAddr.city}</div>
                                <div class="addr-sub">${form.unloadAddr.name} ${form.unloadAddr.detail} · ${form.unloadAddr.receiverName || form.unloadAddr.contactName || ''} ${form.unloadAddr.receiverPhone || form.unloadAddr.contactPhone || ''}</div>
                            </div>
                            <span class="material-icons" style="color: #ccc;">chevron_right</span>
                        </div>
                    </div>

                    <div class="card">
                        <div id="cargo-info-trigger" class="flex justify-between items-center" style="padding: 12px 0; border-bottom: 1px solid #f9f9f9; cursor: pointer;">
                            <span style="color: var(--text-secondary);">货物信息</span>
                            <span style="font-weight: 500;">${form.cargoName}, ${form.packaging}, ${form.weight || '0'}${form.isKg ? '公斤' : '吨'}, ${form.volume || '0'}方 ></span>
                        </div>
                        <div id="vehicle-select-trigger" class="flex justify-between items-center" style="padding: 12px 0; cursor: pointer;">
                            <span style="color: var(--text-secondary);">车长车型</span>
                            <div class="flex items-center" style="gap: 8px;">
                                <img src="https://img.icons8.com/color/48/000000/truck.png" style="width: 20px;">
                                <span style="font-weight: bold;">长${form.vehicleLength} ${form.vehicleType} ></span>
                            </div>
                        </div>
                    </div>

                    <div class="card">
                         <div class="flex justify-between items-center" style="padding: 12px 0; border-bottom: 1px solid #f9f9f9;">
                            <span style="color: var(--text-secondary);">发票类型</span>
                            <div class="select-btn-group" id="invoice-toggles">
                                <div class="select-btn ${form.invoiceType === '专票' ? 'active' : ''}" data-val="专票">专票</div>
                                <div class="select-btn ${form.invoiceType === '不开发票' ? 'active' : ''}" data-val="不开发票">不开发票</div>
                            </div>
                        </div>
                        <div class="flex justify-between items-center" style="padding: 12px 0; border-bottom: 1px solid #f9f9f9; cursor: pointer;" id="pickup-time-trigger">
                            <span style="color: var(--text-secondary);">装货时间</span>
                            <span style="font-weight: 500; color: var(--text-main);">${form.pickupTime} ></span>
                        </div>
                        <div class="flex justify-between items-center" style="padding: 12px 0; cursor: pointer;" id="delivery-time-trigger">
                            <span style="color: var(--text-secondary);">卸货时间</span>
                            <span style="font-weight: 500; color: ${form.deliveryTime === '请填写' ? 'var(--text-secondary)' : 'var(--text-main)'};">${form.deliveryTime} ></span>
                        </div>
                    </div>

                    <div class="card">
                        <div style="margin-bottom: 12px; font-weight: bold; font-size: 15px;">备注说明</div>
                        <div class="select-btn-group" id="note-toggles">
                            ${['无需司机装卸', '到付', '三不招', '需回单', '车厢干净', '禁区'].map(note => `
                                <div class="select-btn ${form.notes.includes(note) ? 'active' : ''}" data-val="${note}" style="border-radius: 4px; padding: 6px 12px; font-size: 12px;">${note}</div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="card">
                        <div style="margin-bottom: 12px; font-weight: bold; font-size: 15px;">服务条款 (时效)</div>
                        <div class="select-btn-group" id="service-toggles">
                            ${['当日达', '次日达', '隔日达', '标准达', '定时达'].map(svc => `
                                <div class="select-btn ${form.serviceType === svc ? 'active' : ''}" data-val="${svc}">${svc}</div>
                            `).join('')}
                        </div>
                    </div>

                    <div style="margin-top: 20px;" id="price-options">
                        <div class="price-option ${form.pricingOption === '整车发货' ? 'selected' : ''}" data-val="整车发货">
                            <span class="material-icons" style="margin-right: 12px; color: ${form.pricingOption === '整车发货' ? 'var(--primary-color)' : '#ccc'};">${form.pricingOption === '整车发货' ? 'check_circle' : 'radio_button_unchecked'}</span>
                            <div style="flex: 1;">
                                <div style="font-weight: bold;">整车发货</div>
                                <div style="font-size: 11px; color: var(--text-secondary);">司机多，价格优</div>
                            </div>
                            <div style="text-align: right;">
                                <div style="font-weight: bold; color: var(--primary-color);">¥180/车</div>
                            </div>
                        </div>
                        <div class="price-option ${form.pricingOption === '专线物流' ? 'selected' : ''}" data-val="专线物流">
                             <span class="material-icons" style="margin-right: 12px; color: ${form.pricingOption === '专线物流' ? 'var(--primary-color)' : '#ccc'};">${form.pricingOption === '专线物流' ? 'check_circle' : 'radio_button_unchecked'}</span>
                            <div style="flex: 1;">
                                <div style="font-weight: bold;">专线物流</div>
                                <div style="font-size: 11px; color: var(--text-secondary);">点对点直达，时效稳</div>
                            </div>
                            <div style="text-align: right;">
                                <div style="font-weight: bold;">¥165/车起</div>
                            </div>
                        </div>
                        <div class="price-option ${form.pricingOption === '零担拼车' ? 'selected' : ''}" data-val="零担拼车">
                             <span class="material-icons" style="margin-right: 12px; color: ${form.pricingOption === '零担拼车' ? 'var(--primary-color)' : '#ccc'};">${form.pricingOption === '零担拼车' ? 'check_circle' : 'radio_button_unchecked'}</span>
                            <div style="flex: 1;">
                                <div style="font-weight: bold;">零担拼车</div>
                                <div style="font-size: 11px; color: var(--text-secondary);">拼车更划算</div>
                            </div>
                            <div style="text-align: right;">
                                <div style="font-weight: bold;">¥99/票起</div>
                            </div>
                        </div>
                    </div>

                    <div style="padding: 24px 0 10px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; padding: 0 4px;">
                            <span style="font-size: 14px; color: #666;">预估运费</span>
                            <span style="font-size: 24px; font-weight: bold; color: var(--orange-main);">¥170.00</span>
                        </div>
                        <button class="btn btn-primary" id="publish-btn" style="background: var(--orange-main); height: 52px; border-radius: 26px; font-size: 18px; font-weight: bold; width: 100%; box-shadow: 0 4px 15px rgba(255, 130, 0, 0.4); margin-bottom: 10px;">立即发货</button>
                    </div>
                </div>
            </div>
        `;

        // --- Bind Events ---
        document.getElementById('vehicle-select-trigger').onclick = () => this.navigate('vehicleSelection');
        document.getElementById('cargo-info-trigger').onclick = () => this.navigate('cargoInfo');

        // Address Triggers
        document.getElementById('load-addr-trigger').onclick = () => this.navigate('addressPicker', { type: 'load' });
        document.getElementById('unload-addr-trigger').onclick = () => this.navigate('addressPicker', { type: 'unload' });

        // Time Triggers
        document.getElementById('pickup-time-trigger').onclick = () => this.navigate('timePicker', { type: 'pickup' });
        document.getElementById('delivery-time-trigger').onclick = () => this.navigate('timePicker', { type: 'delivery' });

        document.querySelectorAll('#invoice-toggles .select-btn').forEach(btn => {
            btn.onclick = () => {
                this.shipForm.invoiceType = btn.dataset.val;
                this.renderShip();
            };
        });

        document.querySelectorAll('#note-toggles .select-btn').forEach(btn => {
            btn.onclick = () => {
                const val = btn.dataset.val;
                const idx = this.shipForm.notes.indexOf(val);
                if (idx > -1) this.shipForm.notes.splice(idx, 1);
                else this.shipForm.notes.push(val);
                this.renderShip();
            };
        });

        document.querySelectorAll('#service-toggles .select-btn').forEach(btn => {
            btn.onclick = () => {
                this.shipForm.serviceType = btn.dataset.val;
                this.renderShip();
            };
        });

        document.querySelectorAll('#price-options .price-option').forEach(opt => {
            opt.onclick = () => {
                this.shipForm.pricingOption = opt.dataset.val;
                this.renderShip();
            };
        });

        document.getElementById('publish-btn').onclick = () => {
            const newWb = {
                id: 'WB' + Date.now().toString().slice(-8),
                status: '待装货',
                origin: this.shipForm.loadAddr.city.split(' ')[0],
                destination: this.shipForm.unloadAddr.city.split(' ')[0],
                cargo: this.shipForm.cargoName,
                weight: (this.shipForm.weight || '0') + (this.shipForm.isKg ? '公斤' : '吨'),
                driver: '',
                plate: '',
                date: new Date().toISOString().split('T')[0]
            };
            MockData.waybills.unshift(newWb);
            alert('货源发布成功！');
            this.navigate('waybills');
        };
    }

    renderCargoInfo() {
        const form = this.shipForm;
        this.main.innerHTML = `
            <div class="bg-light" style="min-height: 100%; padding-bottom: 0;">
                <header style="background: white; padding: 12px 16px; border-bottom: 1px solid var(--border-color); display: flex; align-items: center; gap: 12px;">
                    <span class="material-icons" onclick="app.navigate('ship')" style="cursor: pointer; color: var(--text-secondary);">arrow_back</span>
                    <h2 style="font-size: 18px; margin: 0; flex: 1; text-align: center;">货物信息</h2>
                </header>

                <div class="container" style="padding-top: 12px;">
                    <div class="card" style="padding: 0 16px;">
                        <div id="cargo-name-trigger" class="flex justify-between items-center" style="padding: 16px 0; border-bottom: 1px solid #f9f9f9; cursor: pointer;">
                            <span style="color: var(--text-secondary); font-size: 14px;">货物名称</span>
                            <span style="font-weight: bold; color: #333; font-size: 14px;">${form.cargoName} ></span>
                        </div>
                        <div style="padding: 16px 0;">
                            <div style="color: var(--text-secondary); margin-bottom: 12px; font-size: 14px;">包装方式</div>
                            <div class="select-btn-group" id="packaging-toggles">
                                ${['吨包', '散装', '袋装', '托盘', '其他'].map(p => `
                                    <div class="select-btn ${form.packaging === p ? 'active-green' : ''}" data-val="${p}">${p}</div>
                                `).join('')}
                            </div>
                        </div>
                    </div>

                    <div class="card" style="padding: 16px; border-radius: 16px;">
                        <div class="flex justify-between items-center" style="margin-bottom: 24px;">
                            <div style="font-weight: bold; font-size: 16px; color: #333;">总重量/体积 <span style="font-weight: normal; font-size: 13px; color: #999;">(选填一项)</span></div>
                            <div class="flex items-center" style="gap: 8px;">
                                <span style="font-size: 14px; color: #666;">按公斤</span>
                                <label class="switch">
                                    <input type="checkbox" id="kg-toggle" ${form.isKg ? 'checked' : ''}>
                                    <span class="slider"></span>
                                </label>
                            </div>
                        </div>

                        <div class="flex items-center justify-between mb-6">
                            <span style="color: #666; font-size: 15px;">重量</span>
                            <div class="flex items-center gap-3">
                                <div class="stepper" style="background: #F8F9FA; border-radius: 8px; padding: 4px; display: flex; align-items: center; border: 1px solid #eee;">
                                    <div class="stepper-btn" id="weight-minus" style="font-size: 20px; color: #ccc; width: 32px; text-align: center; cursor: pointer;">-</div>
                                    <input type="number" class="stepper-input" id="weight-input" value="${form.weight}" placeholder="${form.isKg ? '0-1000' : '0-20'}" style="background: transparent; border: none; font-size: 18px; font-weight: bold; width: 80px; text-align: center; outline: none;">
                                    <div class="stepper-btn" id="weight-plus" style="font-size: 20px; color: #ccc; width: 32px; text-align: center; cursor: pointer;">+</div>
                                </div>
                                <span style="color: #333; font-size: 15px; min-width: 20px;">${form.isKg ? '公斤' : '吨'}</span>
                            </div>
                        </div>

                        <div class="flex items-center justify-between">
                            <span style="color: #666; font-size: 15px;">体积</span>
                            <div class="flex items-center gap-3">
                                <div class="stepper" style="background: #F8F9FA; border-radius: 8px; padding: 4px; display: flex; align-items: center; border: 1px solid #eee;">
                                    <div class="stepper-btn" id="volume-minus" style="font-size: 20px; color: #ccc; width: 32px; text-align: center; cursor: pointer;">-</div>
                                    <input type="number" class="stepper-input" id="volume-input" value="${form.volume}" placeholder="0-70" style="background: transparent; border: none; font-size: 18px; font-weight: bold; width: 80px; text-align: center; outline: none;">
                                    <div class="stepper-btn" id="volume-plus" style="font-size: 20px; color: #ccc; width: 32px; text-align: center; cursor: pointer;">+</div>
                                </div>
                                <span style="color: #333; font-size: 15px; min-width: 20px;">方</span>
                            </div>
                        </div>

                        <div style="margin-top: 24px; text-align: center; border-top: 1px solid #f9f9f9; padding-top: 12px;">
                            <div style="font-size: 12px; color: #999; display: flex; align-items: center; justify-content: center; gap: 4px;">
                                补充更多信息，司机接单更快
                                <span class="material-icons" style="font-size: 14px;">expand_less</span>
                            </div>
                        </div>

                        <div style="margin-top: 20px; display: flex; justify-content: space-between; align-items: center;">
                            <span style="color: var(--text-secondary); font-size: 14px;">尺寸</span>
                            <div class="flex items-center gap-2" id="dimension-inputs">
                                <input type="number" class="stepper-input" style="width: 50px; background: #F4F7FB; border-radius: 4px; padding: 6px; font-size: 13px;" placeholder="长" value="${form.dimensions.l}" id="dim-l">
                                <input type="number" class="stepper-input" style="width: 50px; background: #F4F7FB; border-radius: 4px; padding: 6px; font-size: 13px;" placeholder="宽" value="${form.dimensions.w}" id="dim-w">
                                <input type="number" class="stepper-input" style="width: 50px; background: #F4F7FB; border-radius: 4px; padding: 6px; font-size: 13px;" placeholder="高" value="${form.dimensions.h}" id="dim-h">
                                <span style="color: var(--text-secondary); font-size: 13px;">米</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div style="position: fixed; bottom: 0; left: 0; right: 0; padding: 12px 16px; background: white; border-top: 1px solid #eee;">
                    <button class="btn btn-primary" id="confirm-cargo-btn" style="background: var(--primary-color); border-radius: 24px; height: 48px;">确定</button>
                </div>
            </div>
        `;

        document.getElementById('cargo-name-trigger').onclick = () => this.renderCargoNameSelection();

        document.getElementById('kg-toggle').onchange = (e) => {
            this.shipForm.isKg = e.target.checked;
            this.renderCargoInfo();
        };

        document.querySelectorAll('#packaging-toggles .select-btn').forEach(btn => {
            btn.onclick = () => {
                this.shipForm.packaging = btn.dataset.val;
                this.renderCargoInfo();
            };
        });

        const wInput = document.getElementById('weight-input');
        document.getElementById('weight-plus').onclick = () => {
            wInput.value = (parseFloat(wInput.value) || 0) + 1;
            this.shipForm.weight = wInput.value;
        };
        document.getElementById('weight-minus').onclick = () => {
            if (parseFloat(wInput.value) > 0) {
                wInput.value = (parseFloat(wInput.value) || 0) - 1;
                this.shipForm.weight = wInput.value;
            }
        };
        wInput.oninput = () => this.shipForm.weight = wInput.value;

        const vInput = document.getElementById('volume-input');
        document.getElementById('volume-plus').onclick = () => {
            vInput.value = (parseFloat(vInput.value) || 0) + 1;
            this.shipForm.volume = vInput.value;
        };
        document.getElementById('volume-minus').onclick = () => {
            if (parseFloat(vInput.value) > 0) {
                vInput.value = (parseFloat(vInput.value) || 0) - 1;
                this.shipForm.volume = vInput.value;
            }
        };
        vInput.oninput = () => this.shipForm.volume = vInput.value;

        ['l', 'w', 'h'].forEach(dim => {
            document.getElementById(`dim-${dim}`).oninput = (e) => this.shipForm.dimensions[dim] = e.target.value;
        });

        document.getElementById('confirm-cargo-btn').onclick = () => this.navigate('ship');
    }

    renderCargoNameSelection() {
        this.main.innerHTML = `
            <div class="bg-light" style="min-height: 100%;">
                <header style="background: white; padding: 12px 16px; border-bottom: 1px solid var(--border-color); display: flex; align-items: center; gap: 12px;">
                    <span class="material-icons" id="back-to-cargo-info" style="cursor: pointer; color: var(--text-secondary);">arrow_back</span>
                    <h2 style="font-size: 18px; margin: 0; flex: 1; text-align: center;">货物名称</h2>
                </header>

                <div class="container" style="padding-top: 1px;">
                    <div class="search-container" style="margin: 12px 16px; background: white;">
                        <span class="material-icons" style="color: #999; font-size: 20px;">search</span>
                        <input type="text" class="search-input" id="cargo-search" placeholder="请如实填写货物名称">
                    </div>

                    <div style="padding: 0 16px;">
                        <div style="display: flex; align-items: center; gap: 6px; margin: 20px 0 12px;">
                            <span class="material-icons" style="color: #FF7A45; font-size: 18px;">whatshot</span>
                            <span style="font-weight: bold; font-size: 15px;">热门货物</span>
                        </div>
                        <div class="select-btn-group" id="hot-cargo-list">
                            ${['豆渣饲料', '百货', '模板块', '建材', '配件零件', '食品饮料', '化工塑料', '农用物资', '金属钢材', '机械设备'].map(item => `
                                <div class="select-btn" data-val="${item}">${item}</div>
                            `).join('')}
                        </div>
                    </div>

                    <div id="search-results" style="margin: 20px 16px; background: white; border-radius: 12px; display: none; box-shadow: 0 2px 12px rgba(0,0,0,0.05); overflow: hidden;">
                        <!-- Results -->
                    </div>
                </div>
            </div>
        `;

        document.getElementById('back-to-cargo-info').onclick = () => this.renderCargoInfo();

        const searchInput = document.getElementById('cargo-search');
        const resultsDiv = document.getElementById('search-results');

        searchInput.oninput = (e) => {
            const val = e.target.value;
            if (val.length > 0) {
                resultsDiv.style.display = 'block';
                resultsDiv.innerHTML = `
                    <div style="padding: 16px; color: var(--primary-color); font-weight: 500; border-bottom: 1px solid #f9f9f9;">${val}</div>
                    ${[val + '材', val + '圆钢', val + '型材', val + '卷'].map(res => `
                        <div class="search-res-item" style="padding: 16px; border-bottom: 1px solid #f9f9f9; color: #333; cursor: pointer;" data-val="${res}">${res}</div>
                    `).join('')}
                `;
                document.querySelectorAll('.search-res-item').forEach(item => {
                    item.onclick = () => {
                        this.shipForm.cargoName = item.dataset.val;
                        this.renderCargoInfo();
                    };
                });
            } else {
                resultsDiv.style.display = 'none';
            }
        };

        document.querySelectorAll('#hot-cargo-list .select-btn').forEach(btn => {
            btn.onclick = () => {
                this.shipForm.cargoName = btn.dataset.val;
                this.renderCargoInfo();
            };
        });
    }

    renderVehicleSelection() {
        const form = this.shipForm;
        this.main.innerHTML = `
            <div class="bg-light" style="min-height: 100%; padding-bottom: 0;">
                <header style="background: white; padding: 12px 16px; border-bottom: 1px solid var(--border-color); display: flex; align-items: center; gap: 12px;">
                    <span class="material-icons" id="back-to-ship" style="cursor: pointer; color: var(--text-secondary);">arrow_back</span>
                    <h2 style="font-size: 18px; margin: 0; flex: 1; text-align: center;">车长车型</h2>
                </header>

                <div style="background: white; padding: 24px 20px; text-align: center; margin-bottom: 12px;">
                    <div style="color: var(--text-secondary); font-size: 12px; margin-bottom: 20px;">严禁超载超限，请合理选择车辆</div>
                    
                    <div style="position: relative; display: inline-block; width: 100%; max-width: 280px;">
                        <img src="https://img.icons8.com/color/144/000000/truck.png" style="width: 100%; opacity: 0.8;">
                        <div style="position: absolute; top: 15%; right: 10%; background: var(--primary-light); border: 1px dashed var(--primary-color); color: var(--primary-color); padding: 4px 8px; border-radius: 4px; font-size: 10px; font-weight: bold;">
                             厢长 ${form.vehicleLength}m <br> 车型 ${form.vehicleType}
                        </div>
                    </div>

                    <div style="display: flex; justify-content: space-around; margin-top: 24px; background: var(--bg-body); padding: 12px; border-radius: 8px;">
                        <div>
                            <div style="font-size: 11px; color: var(--text-secondary);">车长</div>
                            <div style="font-weight: bold; font-size: 15px;">${form.vehicleLength}米</div>
                        </div>
                        <div style="width: 1px; background: #ddd;"></div>
                        <div>
                            <div style="font-size: 11px; color: var(--text-secondary);">载重</div>
                            <div style="font-weight: bold; font-size: 15px;">4-6吨</div>
                        </div>
                        <div style="width: 1px; background: #ddd;"></div>
                        <div>
                            <div style="font-size: 11px; color: var(--text-secondary);">体积</div>
                            <div style="font-weight: bold; font-size: 15px;">17.3-26.4方</div>
                        </div>
                    </div>
                </div>

                <div class="container">
                    <div class="card">
                        <div style="font-weight: bold; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                            <span style="width: 3px; height: 14px; background: var(--primary-color);"></span>
                            车长 <span style="font-weight: normal; font-size: 12px; color: var(--text-secondary);">(必填, 最多3项)</span>
                        </div>
                        <div class="grid-select" id="length-grid">
                            ${[1.4, 1.8, 2.7, 3.8, 4.2, 5, 6.2, 6.8, 7.7, 8.2, 8.7, 9.6].map(l => `
                                <div class="grid-item ${form.vehicleLength == l ? 'active' : ''}" data-val="${l}">${l}</div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="card">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                            <div style="font-weight: bold; display: flex; align-items: center; gap: 8px;">
                                <span style="width: 3px; height: 14px; background: var(--primary-color);"></span>
                                车型 <span style="font-weight: normal; font-size: 12px; color: var(--text-secondary);">(必填, 最多3项)</span>
                            </div>
                            <span id="car-detail-trigger" style="color: var(--primary-color); font-size: 12px; cursor: pointer;">查看车型示例 ></span>
                        </div>
                        <div class="grid-select" id="type-grid">
                            ${['普通货车', '高栏车', '厢式货车', '罐式货车', '牵引车'].map(t => `
                                <div class="grid-item ${form.vehicleType === t ? 'active' : ''}" data-val="${t}">${t}</div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <div style="position: fixed; bottom: 0; left: 0; right: 0; padding: 12px 16px; background: white; box-shadow: 0 -2px 10px rgba(0,0,0,0.05);">
                    <button class="btn btn-primary" id="confirm-vehicle-btn" style="background: var(--primary-color); height: 48px; border-radius: 24px;">确定</button>
                </div>
            </div>
        `;

        document.getElementById('back-to-ship').onclick = () => this.navigate('ship');
        document.getElementById('confirm-vehicle-btn').onclick = () => this.navigate('ship');
        document.getElementById('car-detail-trigger').onclick = () => this.renderVehicleDetails();

        // Add interaction logic
        const lengthGrid = document.getElementById('length-grid');
        const typeGrid = document.getElementById('type-grid');

        if (lengthGrid) {
            lengthGrid.onclick = (e) => {
                if (e.target.classList.contains('grid-item')) {
                    Array.from(lengthGrid.children).forEach(c => c.classList.remove('active'));
                    e.target.classList.add('active');
                    this.shipForm.vehicleLength = e.target.getAttribute('data-val');
                    this.renderVehicleSelection(); // Re-render to update top visuals
                }
            };
        }

        if (typeGrid) {
            typeGrid.onclick = (e) => {
                if (e.target.classList.contains('grid-item')) {
                    Array.from(typeGrid.children).forEach(c => c.classList.remove('active'));
                    e.target.classList.add('active');
                    this.shipForm.vehicleType = e.target.getAttribute('data-val');
                    this.renderVehicleSelection(); // Re-render to update top visuals
                }
            };
        }
    }

    renderVehicleDetails() {
        this.main.innerHTML = `
            <div class="bg-light" style="min-height: 100%; padding-bottom: 0;">
                <header style="background: white; padding: 12px 16px; border-bottom: 1px solid var(--border-color); display: flex; align-items: center; gap: 12px;">
                    <span class="material-icons" id="back-to-v-select" style="cursor: pointer; color: var(--text-secondary);">arrow_back</span>
                    <h2 style="font-size: 18px; margin: 0; flex: 1; text-align: center;">车辆详情</h2>
                </header>

                <div class="container">
                    <div style="margin: 20px 0 16px; font-weight: bold; display: flex; align-items: center; gap: 8px;">
                        <span style="width: 4px; height: 16px; background: var(--primary-color); border-radius: 2px;"></span>
                        平台支持的车型
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px 12px;">
                        ${this.renderCarDetailCard('普通货车', 'https://img.icons8.com/color/96/000000/truck.png')}
                        ${this.renderCarDetailCard('高栏车', 'https://img.icons8.com/color/96/000000/truck.png')}
                        ${this.renderCarDetailCard('厢式货车', 'https://img.icons8.com/color/96/000000/box-truck.png')}
                        ${this.renderCarDetailCard('罐式货车', 'https://img.icons8.com/color/96/000000/tank-truck.png')}
                        ${this.renderCarDetailCard('牵引车', 'https://img.icons8.com/color/96/000000/trailer.png')}
                    </div>

                    <div style="margin: 32px 0 16px; font-weight: bold; display: flex; align-items: center; gap: 8px;">
                        <span style="width: 4px; height: 16px; background: #999; border-radius: 2px;"></span>
                        平台不支持的车型
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                        <div style="text-align: center; display: flex; flex-direction: column; align-items: center; gap: 8px;">
                            <img src="https://img.icons8.com/color/96/000000/truck.png" style="width: 56px; height: 56px; object-fit: contain; filter: grayscale(1);">
                            <div class="vehicle-label-divider">特殊车型</div>
                            <div style="font-size: 11px; color: var(--text-secondary); margin-top: 4px; padding: 0 10px;">部分特殊车型不支持选择，若有需求可添加车型特殊要求</div>
                        </div>
                    </div>
                </div>
            </div>
            `;

        document.getElementById('back-to-v-select').onclick = () => this.renderVehicleSelection();
    }

    renderCarDetailCard(name, icon) {
        return `
            <div style="text-align: center; display: flex; flex-direction: column; align-items: center; gap: 8px;" >
                <img src="${icon}" style="width: 56px; height: 56px; object-fit: contain;">
                    <div class="vehicle-label-divider">${name}</div>
                </div>
        `;
    }

    renderWaybills(status = '全部') {
        this.main.innerHTML = `
            <div class="bg-light" style="min-height: 100%; padding-bottom: 0;" >
                <div class="container">
                    <header style="padding: 16px 0;">
                        <h2 style="font-size: 22px; font-weight: bold; margin: 0; color: #333;">我的运单</h2>
                    </header>

                    <!-- Status Tabs from Image -->
                    <div id="waybill-status-tabs" style="display: flex; gap: 12px; margin-bottom: 20px; overflow-x: auto; padding-bottom: 4px;">
                        ${['全部', '未接单', '已接单', '运输中', '已签收', '已回单', '已结算', '已取消'].map(s => `
                            <div class="status-tab" data-status="${s}" style="padding: 10px 24px; background: ${status === s ? 'var(--primary-color)' : 'white'}; color: ${status === s ? 'white' : '#666'}; border-radius: 99px; font-weight: ${status === s ? '500' : 'normal'}; font-size: 14px; white-space: nowrap; cursor: pointer; transition: all 0.2s;">${s}</div>
                        `).join('')}
                    </div>

                    <div>
                        ${MockData.waybills
                .filter(wb => status === '全部' || wb.status === status)
                .map(wb => this.renderWaybillCard(wb)).join('')}
                        ${MockData.waybills.filter(wb => status === '全部' || wb.status === status).length === 0 ? '<div style="text-align: center; padding: 40px; color: #999;">暂无相关运单</div>' : ''}
                    </div>
                </div>
            </div>
            `;

        document.querySelectorAll('.status-tab').forEach(tab => {
            tab.onclick = () => {
                const s = tab.dataset.status;
                this.renderWaybills(s);
            };
        });
    }

    renderStatements() {
        this.main.innerHTML = `
            <div class="container" >
                <header class="mb-4"><h2 style="font-size: 20px; margin: 0;">账单管理</h2></header>
                ${MockData.statements.map(st => `
                    <div class="card" style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <div style="font-weight: bold; font-size: 16px;">${st.month}</div>
                            <div style="font-size: 12px; color: var(--text-secondary);">共 ${Math.floor(Math.random() * 20)} 单</div>
                        </div>
                        <div class="text-center">
                            <div style="font-weight: bold; font-size: 16px;">¥${st.amount.toLocaleString()}</div>
                            <div style="font-size: 12px; color: ${st.status === '已结清' ? 'green' : 'var(--accent-color)'};">${st.status}</div>
                        </div>
                    </div>
                `).join('')
            }
                
                <h3 style="font-size: 16px; margin-top: 24px;">发票管理</h3>
                <div class="card" style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <div>可开票金额</div>
                        <div style="font-size: 20px; font-weight: bold; color: var(--primary-color);">¥15,800.00</div>
                    </div>
                    <button class="btn btn-primary" style="width: auto; padding: 6px 16px; font-size: 12px;">申请开票</button>
                </div>
            </div>
            `;
    }

    renderProfile() {
        const user = MockData.user;
        const stats = MockData.stats;
        this.main.innerHTML = `
            <div class="bg-light" style="min-height: 100%; padding-bottom: 0;" >
                <!--Header Background-->
                <div style="background: var(--primary-color); padding: 40px 20px 60px; color: white;">
                    <div style="display: flex; align-items: center; gap: 16px; cursor: pointer;" id="profile-header-trigger">
                        <div style="width: 72px; height: 72px; background: rgba(255,255,255,0.2); border-radius: 50%; padding: 4px; display: flex; align-items: center; justify-content: center;">
                            <img src="${user.avatar}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover; border: 2px solid white;">
                        </div>
                        <div style="flex: 1;">
                            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                                <div style="font-size: 24px; font-weight: bold;">${user.name}</div>
                                <div style="background: rgba(255,255,255,0.2); padding: 2px 8px; border-radius: 4px; display: flex; align-items: center; gap: 4px;">
                                    <span class="material-icons" style="font-size: 14px; color: #4ADE80;">verified</span>
                                    <span style="font-size: 11px; font-weight: 500;">已实名</span>
                                </div>
                            </div>
                            <div style="font-size: 14px; opacity: 0.9;">${user.phone}</div>
                        </div>
                    </div>
                </div>

                <div class="container" style="margin-top: -40px;">
                    <!-- Wallet Card (Image 1 Style) - Moved Up -->
                    <div class="card" onclick="app.navigate('walletDetail')" style="padding: 16px; margin-bottom: 12px; cursor: pointer;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                            <span style="font-size: 18px; font-weight: bold; color: #333;">我的钱包</span>
                            <span style="font-size: 14px; color: #999;">去实名 <span class="material-icons" style="font-size: 14px; vertical-align: middle;">chevron_right</span></span>
                        </div>
                        <div style="text-align: left; margin-bottom: 12px;">
                            <span style="font-size: 32px; font-weight: bold; color: #333;">${(user.balance || 0).toFixed(2)} <span style="font-size: 16px; font-weight: normal;">元</span></span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 4px; color: #999; font-size: 14px;">
                            钱包余额 <span class="material-icons" style="font-size: 18px;">visibility</span>
                        </div>
                    </div>

                    <!-- Star Rating Card (Image 2 Style) -->
                    <div class="card" id="star-rating-trigger" style="padding: 16px; margin-bottom: 12px; cursor: pointer;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <span style="font-size: 18px; font-weight: bold; color: #333;">我的星级分</span>
                                <div style="width: 1px; height: 14px; background: #eee;"></div>
                                <span style="font-size: 14px; color: #8B4513;">行为好 分数高 找车快</span>
                            </div>
                            <span class="material-icons" style="color: #ccc; font-size: 20px;">chevron_right</span>
                        </div>
                        <div style="display: flex; gap: 8px;">
                            <div style="background: #FFFBEB; color: #333; padding: 4px 10px; border-radius: 4px; font-size: 13px;">结算 4.50</div>
                            <div style="background: #FFFBEB; color: #333; padding: 4px 10px; border-radius: 4px; font-size: 13px;">爽约 4.50</div>
                            <div style="background: #FFFBEB; color: #333; padding: 4px 10px; border-radius: 4px; font-size: 13px;">评价 4.50</div>
                        </div>
                    </div>

                    <!-- Section: Business Management -->
                    <div style="margin-bottom: 6px; padding-left: 4px; font-size: 14px; color: #666; font-weight: 500;">发货管理</div>
                    <div class="card" style="padding: 0; margin-bottom: 12px;">
                        <div class="profile-item flex justify-between items-center" style="padding: 16px; border-bottom: 1px solid #f9f9f9; cursor: pointer;" onclick="app.navigate('waybills')">
                            <div class="flex items-center gap-3">
                                <div style="width: 36px; height: 36px; background: #f4f7fb; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                                    <span class="material-icons" style="font-size: 20px; color: var(--primary-color);">receipt_long</span>
                                </div>
                                <span style="font-size: 15px; color: #333; font-weight: 400;">发货记录</span>
                            </div>
                            <div class="flex items-center gap-1">
                                <span style="font-size: 13px; color: #999;">查看全部</span>
                                <span class="material-icons" style="font-size: 18px; color: #ccc;">chevron_right</span>
                            </div>
                        </div>
                        <div class="profile-item flex justify-between items-center" style="padding: 16px; border-bottom: 1px solid #f9f9f9; cursor: pointer;" onclick="app.navigate('frequentRoutes')">
                            <div class="flex items-center gap-3">
                                <div style="width: 36px; height: 36px; background: #f4f7fb; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                                    <span class="material-icons" style="font-size: 20px; color: var(--primary-color);">explore</span>
                                </div>
                                <span style="font-size: 15px; color: #333; font-weight: 400;">常发路线</span>
                            </div>
                            <div class="flex items-center gap-1">
                                <span class="material-icons" style="font-size: 18px; color: #ccc;">chevron_right</span>
                            </div>
                        </div>
                    </div>


                    <!-- Section: Authentication -->
                    <div style="margin-bottom: 6px; padding-left: 4px; font-size: 14px; color: #666; font-weight: 500;">账号认证</div>
                    <div class="card" style="padding: 0; margin-bottom: 12px;">
                        <div class="profile-item flex justify-between items-center" style="padding: 16px; border-bottom: 1px solid #f9f9f9; cursor: pointer;" id="id-auth-item-profile">
                            <div class="flex items-center gap-3">
                                <div style="width: 36px; height: 36px; background: #f4f7fb; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                                    <span class="material-icons" style="font-size: 20px; color: var(--primary-color);">admin_panel_settings</span>
                                </div>
                                <span style="font-size: 15px; color: #333;">身份认证</span>
                            </div>
                            <div class="flex items-center gap-1">
                                <span class="material-icons" style="font-size: 16px; color: var(--status-green);">check_circle</span>
                                <span style="font-size: 13px; color: var(--status-green); opacity: 0.8;">已认证</span>
                                <span class="material-icons" style="font-size: 18px; color: #ccc;">chevron_right</span>
                            </div>
                        </div>
                        <div class="profile-item flex justify-between items-center" style="padding: 16px; border-bottom: none; cursor: pointer;" id="ent-auth-item-profile">
                            <div class="flex items-center gap-3">
                                <div style="width: 36px; height: 36px; background: #f4f7fb; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                                    <span class="material-icons" style="font-size: 20px; color: var(--primary-color);">business</span>
                                </div>
                                <span style="font-size: 15px; color: #333;">企业认证</span>
                            </div>
                            <div class="flex items-center gap-1">
                                <span class="material-icons" style="font-size: 16px; color: var(--status-green);">check_circle</span>
                                <span style="font-size: 13px; color: var(--status-green); opacity: 0.8;">已认证</span>
                                <span class="material-icons" style="font-size: 18px; color: #ccc;">chevron_right</span>
                            </div>
                        </div>
                    </div>

                    <div class="card" style="padding: 0; margin-top: 12px;" id="profile-items-container">
                        ${this.renderProfileItem('notifications', '我的消息', MockData.messages.filter(m => !m.isRead).length + '条未读', 'messages')}
                        ${this.renderProfileItem('headset_mic', '在线客服')}
                        ${this.renderProfileItem('settings', '系统设置')}
                    </div>

                    <button class="btn" style="background: #fff; color: #FF4D4F; border: none; margin-top: 12px; font-weight: 500; height: 48px; border-radius: 12px; font-size: 15px; box-shadow: var(--shadow-sm);" id="logout-btn">退出登录</button>
                    <div style="text-align: center; font-size: 11px; color: #ccc; margin-top: 12px; padding-bottom: 8px;">当前版本 v2.4.0</div>
                </div>
            </div>
            `;

        document.getElementById('profile-header-trigger').onclick = () => this.navigate('profileEdit');
        document.getElementById('id-auth-item-profile').onclick = () => this.navigate('identityVerify');
        document.getElementById('ent-auth-item-profile').onclick = () => this.navigate('enterpriseAuth');
        document.getElementById('star-rating-trigger').onclick = () => this.navigate('starRatingDetail');
        document.getElementById('logout-btn').onclick = () => {
            MockData.user.isLoggedIn = false;
            this.navigate('login');
        };

        const container = document.getElementById('profile-items-container');
        if (container) {
            container.querySelectorAll('.profile-item').forEach(item => {
                item.onclick = () => {
                    const target = item.dataset.target;
                    if (target) this.navigate(target);
                };
            });
        }
    }

    renderStarRatingDetail() {
        this.main.innerHTML = `
            <div class="bg-light" style="min-height: 100%;" >
                <header style="background: white; padding: 12px 16px; border-bottom: 1px solid var(--border-color); display: flex; align-items: center; gap: 12px;">
                    <span class="material-icons" onclick="app.navigate('profile')" style="cursor: pointer; color: var(--text-main);">arrow_back_ios</span>
                    <div style="flex: 1; display: flex; align-items: baseline; gap: 8px;">
                        <h2 style="font-size: 18px; margin: 0; font-weight: bold;">我的星级分</h2>
                        <span style="font-size: 12px; color: #666;">行为好 分数高 接单快</span>
                    </div>
                    <div style="display: flex; flex-direction: column; align-items: center;">
                        <span class="material-icons" style="font-size: 20px; color: #333;">assignment</span>
                        <span style="font-size: 10px; color: #333;">规则</span>
                    </div>
                </header>

                <div class="container" style="padding-top: 12px;">
                    <!-- Scores Card (Image 3 Style) -->
                    <div class="card" style="padding: 20px;">
                        ${this.renderRatingRow('结算', '4.50')}
                        ${this.renderRatingRow('爽约', '4.50')}
                        ${this.renderRatingRow('评价', '4.50', true)}
                        
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 16px; padding-top: 12px; border-top: 1px solid #f9f9f9;">
                            <span style="font-size: 12px; color: #FF8200;">您当前星级分上限为4.5</span>
                            <span style="font-size: 12px; color: #999; display: flex; align-items: center;">查看规则 <span class="material-icons" style="font-size: 14px;">chevron_right</span></span>
                        </div>
                    </div>

                    <!-- Influence Card -->
                    <div class="card" style="padding: 0; overflow: hidden;">
                        <div style="padding: 12px 16px; background: #fff;">
                            <h3 style="font-size: 16px; font-weight: bold; margin: 0;">星级影响</h3>
                        </div>
                        <div style="padding: 16px; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f9f9f9;">
                            <span style="font-size: 14px; color: #333;">司机接单意愿</span>
                            <span style="font-size: 14px; font-weight: bold; color: #B22222;">强</span>
                        </div>
                    </div>

                    <!-- Detail Tabs Section -->
                    <div style="margin-top: 12px; background: #fff; border-radius: 16px 16px 0 0;">
                        <div style="display: flex; justify-content: space-around; padding: 12px 0; border-bottom: 2px solid #f9f9f9;">
                            <div style="color: #333; font-weight: bold; position: relative;">
                                结算
                                <div style="position: absolute; bottom: -12px; left: 50%; transform: translateX(-50%); width: 24px; height: 3px; background: var(--orange-main); border-radius: 2px;"></div>
                            </div>
                            <div style="color: #666;">爽约</div>
                            <div style="color: #666;">评价</div>
                        </div>
                        <div style="padding: 12px 16px; background: #FFF9F3; margin: 8px 16px; border-radius: 4px;">
                            <span style="font-size: 13px; color: #8B4513;">运费及时结算，货主责任拖欠运费会扣分</span>
                        </div>
                        <div style="display: flex; overflow-x: auto; gap: 8px; padding: 8px 16px;">
                            <div style="padding: 6px 12px; background: #FFF4E6; border: 1px solid var(--orange-main); color: var(--orange-main); border-radius: 4px; font-size: 12px; white-space: nowrap;">2026年01月</div>
                            <div style="padding: 6px 12px; background: #f5f7fa; color: #666; border-radius: 4px; font-size: 12px; white-space: nowrap;">2025年12月</div>
                            <div style="padding: 6px 12px; background: #f5f7fa; color: #666; border-radius: 4px; font-size: 12px; white-space: nowrap;">2025年11月</div>
                            <div style="padding: 6px 12px; background: #f5f7fa; color: #666; border-radius: 4px; font-size: 12px; white-space: nowrap;">2025年10月</div>
                        </div>
                        <div style="padding: 60px 0; text-align: center;">
                            <img src="https://img.icons8.com/isometric/100/box.png" style="width: 80px; opacity: 0.5;">
                            <div style="margin-top: 12px; color: #999; font-size: 14px;">暂无数据</div>
                        </div>
                    </div>
                </div>
            </div>
            `;
    }

    renderRatingRow(label, score, isLast = false) {
        return `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: ${isLast ? '0' : '20px'};" >
                <span style="font-size: 15px; color: #333; font-weight: 500;">${label}</span>
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="display: flex; gap: 2px;">
                        ${Array(4).fill('<span class="material-icons" style="font-size: 18px; color: var(--orange-main);">star</span>').join('')}
                        <span class="material-icons" style="font-size: 18px; color: var(--orange-main);">star_half</span>
                    </div>
                    <span style="font-size: 18px; font-weight: bold; color: var(--orange-main);">${score}</span>
                </div>
            </div>
            `;
    }

    renderWalletDetail() {
        this.main.innerHTML = `
            <div class="bg-light" style="min-height: 100%;" >
                <header style="background: white; padding: 12px 16px; border-bottom: 1px solid var(--border-color); display: flex; align-items: center; justify-content: space-between;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <span class="material-icons" onclick="app.navigate('profile')" style="cursor: pointer; color: var(--text-main);">arrow_back_ios</span>
                        <h2 style="font-size: 18px; margin: 0; font-weight: bold;">钱包</h2>
                    </div>
                    <span style="font-size: 15px; color: #333;">客服</span>
                </header>

                <div style="background: #FFF7ED; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
                    <div style="display: flex; align-items: center; gap: 8px; color: #EA580C; font-size: 13px;">
                        <span class="material-icons" style="font-size: 18px;">volume_up</span>
                        <span>为保证钱包功能正常使用，请尽快进行实名认证 ></span>
                    </div>
                    <span class="material-icons" style="font-size: 18px; color: #EA580C;">chevron_right</span>
                </div>

                <div class="container" style="padding-top: 16px;">
                    <!-- Orange Balance Card (Image 3 Style) -->
                    <div style="background: linear-gradient(to bottom, #FF8200, #FF9500); border-radius: 16px; padding: 24px 16px; color: white; position: relative;">
                        <div style="display: flex; justify-content: center; margin-bottom: 12px;">
                            <div style="background: rgba(255,255,255,0.2); border-radius: 20px; padding: 4px 12px; font-size: 12px; display: flex; align-items: center; gap: 4px; cursor: pointer;">
                                <span class="material-icons" style="font-size: 14px;">verified_user</span>
                                资金受银行监管 >
                            </div>
                        </div>

                        <div style="text-align: center; margin-bottom: 8px; opacity: 0.9; font-size: 14px; display: flex; align-items: center; justify-content: center; gap: 4px;">
                            钱包余额(元) <span class="material-icons" id="balance-visibility-icon" onclick="app.toggleBalanceVisibility()" style="font-size: 18px; cursor: pointer;">${this.isBalanceVisible ? 'visibility' : 'visibility_off'}</span>
                        </div>

                        <div id="wallet-balance-display" style="text-align: center; font-size: 40px; font-weight: bold; margin-bottom: 24px; display: flex; align-items: center; justify-content: center; gap: 12px;">
                            ${this.isBalanceVisible ? (MockData.user.balance || 0).toFixed(2) : '******'} <span class="material-icons" style="font-size: 28px;">chevron_right</span>
                        </div>

                        <!-- Tooltip-like element -->
                        <div style="background: rgba(0,0,0,0.6); color: white; padding: 8px 12px; border-radius: 8px; font-size: 12px; margin: 0 auto 24px; width: fit-content; display: flex; align-items: center; gap: 8px; position: relative;">
                            点击这里可以查看钱包余额变动明细 
                            <span class="material-icons" style="font-size: 14px; color: rgba(255,255,255,0.6); cursor: pointer;">close</span>
                            <div style="position: absolute; bottom: -6px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 6px solid rgba(0,0,0,0.6);"></div>
                        </div>

                        <div style="display: flex; gap: 12px;">
                            <button class="btn" id="trigger-withdraw-btn" style="flex: 1; height: 48px; border: 1.5px solid white; background: transparent; color: white; font-weight: bold; border-radius: 24px; font-size: 16px;">提现</button>
                            <button class="btn" id="trigger-recharge-btn" style="flex: 1; height: 48px; background: white; color: #FF8200; font-weight: bold; border-radius: 24px; font-size: 16px;">充值</button>
                        </div>
                    </div>

                    <!-- Wallet Services Grid -->
                    <div class="card" style="margin-top: 24px; padding: 24px 0; display: grid; grid-template-columns: repeat(3, 1fr); text-align: center; border-radius: 12px;">
                        <div style="display: flex; flex-direction: column; align-items: center; gap: 10px; cursor: default;">
                            <div style="width: 48px; height: 48px; background: #FDF4FF; border-radius: 16px; display: flex; align-items: center; justify-content: center;">
                                <span class="material-icons" style="color: #C026D3; font-size: 28px;">receipt_long</span>
                            </div>
                            <span style="font-size: 13px; color: #333; font-weight: 500;">查账单</span>
                        </div>
                        <div style="display: flex; flex-direction: column; align-items: center; gap: 10px; cursor: pointer;" onclick="app.navigate('bankCards')">
                            <div style="width: 48px; height: 48px; background: #ECFDF5; border-radius: 16px; display: flex; align-items: center; justify-content: center; position: relative;">
                                <span class="material-icons" style="color: #059669; font-size: 28px;">credit_card</span>
                                <div style="position: absolute; top: -6px; right: -24px; background: #EF4444; color: white; font-size: 10px; padding: 2px 8px; border-radius: 10px; white-space: nowrap; font-weight: bold;">绑定解绑</div>
                            </div>
                            <span style="font-size: 13px; color: #333; font-weight: 500;">银行卡</span>
                        </div>
                        <div style="display: flex; flex-direction: column; align-items: center; gap: 10px; cursor: pointer;" onclick="app.navigate('profileEdit')">
                            <div style="width: 48px; height: 48px; background: #EFF6FF; border-radius: 16px; display: flex; align-items: center; justify-content: center; position: relative;">
                                <span class="material-icons" style="color: #2563EB; font-size: 28px;">security</span>
                                <div style="position: absolute; top: -6px; right: -24px; background: #EF4444; color: white; font-size: 10px; padding: 2px 8px; border-radius: 10px; white-space: nowrap; font-weight: bold;">实名设置</div>
                            </div>
                            <span style="font-size: 13px; color: #333; font-weight: 500;">安全设置</span>
                        </div>
                    </div>

                    <!-- Embedded Transaction List -->
                    <div id="transaction-list" class="card" style="margin-top: 16px; padding: 0; background: white; border-radius: 12px; overflow: hidden; min-height: 300px;">
                         ${(MockData.user.transactions || []).map(item => {
            const isIncome = item.amount > 0;
            const amountColor = isIncome ? '#059669' : '#DC2626';
            const amountSign = isIncome ? '+' : '';
            return `
                            <div style="padding: 16px; border-bottom: 1px solid #f9f9f9; display: flex; justify-content: space-between; align-items: flex-start;">
                                <div>
                                    <div style="font-weight: bold; font-size: 16px; color: ${amountColor}; margin-bottom: 4px;">
                                        ${amountSign}${item.amount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </div>
                                    <div style="font-size: 13px; color: #666;">${item.label}</div>
                                </div>
                                <div style="font-size: 13px; color: #999; padding-top: 2px;">
                                    ${item.date}
                                </div>
                            </div>
                            `;
        }).join('') || '<div style="padding: 40px; text-align: center; color: #999;">暂无记录</div>'}
                    </div>
                </div>

                <!-- Recharge Popup Logic -->
                <div id="recharge-backdrop" class="recharge-backdrop"></div>
                <div class="recharge-panel" id="rechargePanel">
                    <button class="close-panel-btn" id="closeRechargePanel"><span class="material-icons">close</span></button>
                    <!-- Steps -->
                    <div class="step-indicator">
                        <div class="step active"><div class="step-circle">1</div><div class="step-text">选择金额</div></div>
                        <div class="step"><div class="step-circle">2</div><div class="step-text">选择支付方式</div></div>
                        <div class="step"><div class="step-circle">3</div><div class="step-text">确认支付</div></div>
                    </div>

                    <!-- Amount Selection -->
                    <div class="amount-selection">
                        <h3>选择充值金额</h3>
                        <div class="amount-options">
                            <div class="amount-option" data-amount="100"><div class="amount-value">¥100</div></div>
                            <div class="amount-option" data-amount="500"><div class="amount-value">¥500</div></div>
                            <div class="amount-option selected" data-amount="1000"><div class="amount-value">¥1,000</div></div>
                            <div class="amount-option" data-amount="2000"><div class="amount-value">¥2,000</div></div>
                            <div class="amount-option" data-amount="5000"><div class="amount-value">¥5,000</div></div>
                            <div class="amount-option" data-amount="10000"><div class="amount-value">¥10,000</div></div>
                        </div>
                        <div class="custom-amount">
                            <h4>自定义金额</h4>
                            <input type="number" id="customAmount" placeholder="请输入充值金额（最低100元）" min="100" step="100">
                        </div>
                    </div>

                    <!-- Payment Methods -->
                    <div class="payment-methods" style="display:none;">
                        <h3>选择支付方式</h3>
                        <div class="payment-options">
                            <div class="payment-option selected" data-method="alipay">
                                <div class="payment-icon alipay"><span class="material-icons">qr_code_scanner</span></div>
                                <div class="payment-info"><h4>支付宝</h4><p>推荐使用，即时到账</p></div>
                            </div>
                            <div class="payment-option" data-method="wechat">
                                <div class="payment-icon wechat"><span class="material-icons">chat</span></div>
                                <div class="payment-info"><h4>微信支付</h4><p>扫码支付，安全快捷</p></div>
                            </div>
                            <div class="payment-option" data-method="bank">
                                <div class="payment-icon bank"><span class="material-icons">account_balance</span></div>
                                <div class="payment-info"><h4>银行转账</h4><p>1-3工作日到账</p></div>
                            </div>
                            <div class="payment-option" data-method="other">
                                <div class="payment-icon other"><span class="material-icons">credit_card</span></div>
                                <div class="payment-info"><h4>其他支付</h4><p>银联、PayPal等</p></div>
                            </div>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="action-buttons">
                        <button class="btn btn-secondary" id="cancelBtn"><span class="material-icons" style="font-size:16px;">close</span> 取消</button>
                        <button class="btn btn-primary" id="nextBtn">下一步 <span class="material-icons" style="font-size:16px;">arrow_forward</span></button>
                    </div>
                </div>

                <!-- Withdraw Panel -->
                <div id="withdraw-backdrop" class="recharge-backdrop"></div>
                <div class="recharge-panel" id="withdrawPanel">
                    <button class="close-panel-btn" id="closeWithdrawPanel"><span class="material-icons">close</span></button>
                    
                    <div class="modal-header-custom">
                        <h3 style="margin: 0; font-size: 18px;">余额提现</h3>
                    </div>

                    <!-- Bank Card Selection (Mock) -->
                    <div style="background: #F9FAFB; padding: 16px; border-radius: 12px; margin-bottom: 20px; display: flex; align-items: center; gap: 12px;">
                        <div style="width: 40px; height: 40px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                            <span class="material-icons" style="color: #005596;">account_balance</span>
                        </div>
                        <div style="flex: 1;">
                            <div style="font-weight: bold; font-size: 15px;">中国建设银行 (6889)</div>
                            <div style="font-size: 12px; color: #666;">两小时内到账</div>
                        </div>
                        <span class="material-icons" style="color: #ccc;">chevron_right</span>
                    </div>

                    <!-- Withdraw Input -->
                    <div style="margin-bottom: 24px;">
                        <div style="font-size: 14px; color: #333; margin-bottom: 8px;">提现金额</div>
                        <div style="display: flex; align-items: baseline; border-bottom: 1px solid #eee; padding-bottom: 8px;">
                            <span style="font-size: 24px; font-weight: bold; margin-right: 8px;">¥</span>
                            <input type="number" id="withdrawAmount" placeholder="0.00" style="flex: 1; border: none; font-size: 32px; font-weight: bold; outline: none; background: transparent;">
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-top: 8px; font-size: 12px;">
                            <span id="withdrawBalanceHint" style="color: #666;">当前可提现余额 ¥${(MockData.user.balance || 0).toFixed(2)}</span>
                            <span id="withdrawAllBtn" style="color: #FF8200; cursor: pointer; font-weight: 500;">全部提现</span>
                        </div>
                        <div id="withdrawError" style="color: #EF4444; font-size: 12px; margin-top: 4px; display: none;">输入金额超过账户余额</div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="action-buttons">
                        <button class="btn btn-secondary" id="cancelWithdrawBtn">取消</button>
                        <button class="btn btn-primary" id="confirmWithdrawBtn" style="background: #ccc; border: none; pointer-events: none;">确认提现</button>
                    </div>
                </div>

                <!-- Payment Modal -->
                <div class="modal" id="paymentModal">
                    <div class="modal-content-custom">
                        <div class="modal-header-custom"><h3>支付宝支付</h3><button class="close-modal-btn" id="closeModal"><span class="material-icons">close</span></button></div>
                        <div class="payment-qr">
                            <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://alipay.com" alt="QR">
                            <p>请扫描二维码完成支付</p>
                            <p>支付金额：<strong id="payment-modal-amount">¥1,000.00</strong></p>
                        </div>
                        <div class="action-buttons">
                            <button class="btn btn-secondary" id="cancelPayment">取消支付</button>
                            <button class="btn btn-success" id="confirmPayment">已完成支付</button>
                        </div>
                    </div>
                </div>

                <!-- Success Modal -->
                <div class="modal" id="successModal">
                    <div class="modal-content-custom">
                        <div class="modal-header-custom"><h3>充值成功</h3><button class="close-modal-btn" id="closeSuccessModal"><span class="material-icons">close</span></button></div>
                        <div class="success-message">
                            <div class="success-icon"><span class="material-icons">check</span></div>
                            <h3>充值成功！</h3>
                            <p>充值金额：<strong id="success-modal-amount">¥1,000.00</strong></p>
                            <p>赠送金额：<strong id="success-modal-bonus">¥30.00</strong></p>
                            <p>到账金额：<strong id="success-modal-total">¥1,030.00</strong></p>
                        </div>
                        <div class="action-buttons">
                            <button class="btn btn-primary" id="backToRecharge">返回充值页面</button>
                            <button class="btn btn-success" id="viewBalance">查看账户余额</button>
                        </div>
                    </div>
                </div>
                
                 <!-- Withdraw Success Modal -->
                <div class="modal" id="withdrawSuccessModal">
                    <div class="modal-content-custom">
                        <div class="modal-header-custom"><h3>提现申请提交成功</h3><button class="close-modal-btn" id="closeWithdrawSuccessModal"><span class="material-icons">close</span></button></div>
                        <div class="success-message">
                            <div class="success-icon" style="background: #10B981;"><span class="material-icons">check</span></div>
                            <h3>提现申请已提交</h3>
                            <p style="color: #666; font-size: 13px; margin-top: -8px;">预计2小时内到账，请留意银行通知</p>
                            <p>提现金额：<strong id="withdrawSuccessAmount">¥0.00</strong></p>
                        </div>
                        <div class="action-buttons">
                            <button class="btn btn-primary" id="finishWithdrawBtn" style="width: 100%;">完成</button>
                        </div>
                    </div>
                </div>

            </div>
            `;

        this.initRechargeLogic();
        this.initWithdrawLogic();
    }


    initRechargeLogic() {
        const amountOptions = document.querySelectorAll('.amount-option');
        const customAmountInput = document.getElementById('customAmount');
        const paymentOptions = document.querySelectorAll('.payment-option');
        const nextBtn = document.getElementById('nextBtn');
        const cancelBtn = document.getElementById('cancelBtn');
        const paymentModal = document.getElementById('paymentModal');
        const successModal = document.getElementById('successModal');
        const closeModalBtn = document.getElementById('closeModal');
        const cancelPaymentBtn = document.getElementById('cancelPayment');
        const confirmPaymentBtn = document.getElementById('confirmPayment');
        const closeSuccessModalBtn = document.getElementById('closeSuccessModal');
        const backToRechargeBtn = document.getElementById('backToRecharge');
        const viewBalanceBtn = document.getElementById('viewBalance');
        const steps = document.querySelectorAll('.step');

        const triggerBtn = document.getElementById('trigger-recharge-btn');
        const panel = document.getElementById('rechargePanel');
        const backdrop = document.getElementById('recharge-backdrop');
        const closePanelBtn = document.getElementById('closeRechargePanel');

        let selectedAmount = 1000;
        let selectedPaymentMethod = 'alipay';
        let currentStep = 1;

        const updateAmountSelection = (amount) => {
            selectedAmount = amount;
            amountOptions.forEach(option => {
                const optionAmount = parseInt(option.getAttribute('data-amount'));
                if (optionAmount === amount) option.classList.add('selected');
                else option.classList.remove('selected');
            });
            const isPresetAmount = Array.from(amountOptions).some(option => parseInt(option.getAttribute('data-amount')) === amount);
            if (!isPresetAmount && amountOptions.length > 0) amountOptions.forEach(option => option.classList.remove('selected'));
        };

        const updatePaymentSelection = (method) => {
            selectedPaymentMethod = method;
            paymentOptions.forEach(option => {
                if (option.getAttribute('data-method') === method) option.classList.add('selected');
                else option.classList.remove('selected');
            });
        };

        const resetSelections = () => {
            updateAmountSelection(1000);
            if (customAmountInput) customAmountInput.value = '';
            updatePaymentSelection('alipay');

            steps.forEach(step => step.classList.remove('active', 'completed'));
            if (steps[0]) steps[0].classList.add('active');

            const paymentMethodsSection = document.querySelector('.payment-methods');
            const amountSelectionSection = document.querySelector('.amount-selection');
            if (paymentMethodsSection) paymentMethodsSection.style.display = 'none';
            if (amountSelectionSection) amountSelectionSection.style.display = 'block';

            if (nextBtn) {
                nextBtn.innerHTML = '下一步 <span class="material-icons" style="font-size:16px;">arrow_forward</span>';
            }
            currentStep = 1;
        };

        const showRechargePanel = () => {
            if (panel) panel.classList.add('active');
            if (backdrop) backdrop.classList.add('active');
            resetSelections();
        };

        const hideRechargePanel = () => {
            if (panel) panel.classList.remove('active');
            if (backdrop) backdrop.classList.remove('active');
        };

        if (triggerBtn) triggerBtn.onclick = showRechargePanel;
        if (closePanelBtn) closePanelBtn.onclick = hideRechargePanel;
        if (backdrop) backdrop.onclick = hideRechargePanel;

        amountOptions.forEach(option => {
            option.onclick = () => {
                const amount = parseInt(option.getAttribute('data-amount'));
                updateAmountSelection(amount);
                if (customAmountInput) customAmountInput.value = '';
                if (currentStep === 2) resetSelections();
            };
        });

        if (customAmountInput) {
            customAmountInput.oninput = function () {
                if (this.value) {
                    const amount = parseInt(this.value);
                    if (amount >= 100) {
                        updateAmountSelection(amount);
                        if (currentStep === 2) {
                            currentStep = 1;
                            const paymentMethodsSection = document.querySelector('.payment-methods');
                            const amountSelectionSection = document.querySelector('.amount-selection');
                            if (paymentMethodsSection) paymentMethodsSection.style.display = 'none';
                            if (amountSelectionSection) amountSelectionSection.style.display = 'block';
                            steps[0].classList.add('active');
                            steps[0].classList.remove('completed');
                            steps[1].classList.remove('active');
                            if (nextBtn) nextBtn.innerHTML = '下一步 <span class="material-icons" style="font-size:16px;">arrow_forward</span>';
                        }
                    }
                }
            };
        }

        paymentOptions.forEach(option => {
            option.onclick = () => {
                const method = option.getAttribute('data-method');
                updatePaymentSelection(method);
            };
        });

        if (nextBtn) {
            nextBtn.onclick = () => {
                if (currentStep === 1) {
                    if (selectedAmount < 100) {
                        alert('充值金额不能低于100元');
                        return;
                    }
                    steps[0].classList.remove('active');
                    steps[0].classList.add('completed');
                    steps[1].classList.add('active');

                    const paymentMethodsSection = document.querySelector('.payment-methods');
                    const amountSelectionSection = document.querySelector('.amount-selection');
                    if (paymentMethodsSection) paymentMethodsSection.style.display = 'block';
                    if (amountSelectionSection) amountSelectionSection.style.display = 'none';

                    nextBtn.innerHTML = '确认支付 <span class="material-icons" style="font-size:16px;">check</span>';
                    currentStep = 2;
                } else if (currentStep === 2) {
                    if (paymentModal) {
                        paymentModal.style.display = 'flex';
                        const modalHeader = paymentModal.querySelector('.modal-header-custom h3');
                        const qrImg = paymentModal.querySelector('.payment-qr img');
                        const amountText = document.getElementById('payment-modal-amount');

                        let paymentName = '支付宝';
                        if (selectedPaymentMethod === 'wechat') paymentName = '微信';
                        else if (selectedPaymentMethod === 'bank') paymentName = '银行转账';
                        else if (selectedPaymentMethod === 'other') paymentName = '其他支付';

                        if (modalHeader) modalHeader.textContent = `${paymentName}支付`;
                        if (qrImg) qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://pay.com/${selectedPaymentMethod}`;
                        if (amountText) amountText.textContent = `¥${selectedAmount.toFixed(2)}`;
                    }
                }
            };
        }

        if (cancelBtn) cancelBtn.onclick = hideRechargePanel;
        if (closeModalBtn) closeModalBtn.onclick = () => paymentModal.style.display = 'none';
        if (cancelPaymentBtn) cancelPaymentBtn.onclick = () => paymentModal.style.display = 'none';

        if (confirmPaymentBtn) {
            confirmPaymentBtn.onclick = () => {
                paymentModal.style.display = 'none';
                steps[1].classList.remove('active');
                steps[1].classList.add('completed');
                steps[2].classList.add('active');

                setTimeout(() => {
                    if (successModal) {
                        successModal.style.display = 'flex';
                        const rechargeAmount = document.getElementById('success-modal-amount');
                        const bonusAmount = document.getElementById('success-modal-bonus');
                        const totalAmount = document.getElementById('success-modal-total');

                        if (rechargeAmount) rechargeAmount.textContent = `¥${selectedAmount.toFixed(2)}`;
                        if (bonusAmount) bonusAmount.parentElement.style.display = 'none';
                        if (totalAmount) totalAmount.textContent = `¥${selectedAmount.toFixed(2)}`;
                    }
                }, 500);
            };
        }

        if (closeSuccessModalBtn) closeSuccessModalBtn.onclick = () => {
            successModal.style.display = 'none';
            hideRechargePanel();
        };

        if (backToRechargeBtn) backToRechargeBtn.onclick = () => {
            successModal.style.display = 'none';
            resetSelections();
        };

        if (viewBalanceBtn) {
            viewBalanceBtn.onclick = () => {
                successModal.style.display = 'none';
                hideRechargePanel();

                MockData.user.balance = (MockData.user.balance || 0) + selectedAmount;
                const newTransaction = {
                    id: Date.now(),
                    amount: selectedAmount,
                    type: 'income',
                    label: '账户充值',
                    date: new Date().toISOString().split('T')[0]
                };
                if (!MockData.user.transactions) MockData.user.transactions = [];
                MockData.user.transactions.unshift(newTransaction);

                localStorage.setItem('cargoUserBalance', MockData.user.balance.toString());
                localStorage.setItem('cargoUserTransactions', JSON.stringify(MockData.user.transactions));

                this.isBalanceVisible = true;
                this.renderWalletDetail(); // Refresh whole view
            };
        }
    }

    initWithdrawLogic() {
        const triggerBtn = document.getElementById('trigger-withdraw-btn');
        const panel = document.getElementById('withdrawPanel');
        const backdrop = document.getElementById('withdraw-backdrop');
        const closePanelBtn = document.getElementById('closeWithdrawPanel');
        const cancelBtn = document.getElementById('cancelWithdrawBtn');
        const confirmBtn = document.getElementById('confirmWithdrawBtn');
        const input = document.getElementById('withdrawAmount');
        const withdrawAllBtn = document.getElementById('withdrawAllBtn');
        const errorMsg = document.getElementById('withdrawError');
        const successModal = document.getElementById('withdrawSuccessModal');
        const closeSuccessBtn = document.getElementById('closeWithdrawSuccessModal');
        const finishBtn = document.getElementById('finishWithdrawBtn');
        const successAmountDisplay = document.getElementById('withdrawSuccessAmount');

        const validateInput = () => {
            if (!input || !confirmBtn) return;
            const amount = parseFloat(input.value);
            const currentBal = MockData.user.balance || 0;

            if (!amount || amount <= 0) {
                confirmBtn.style.background = '#ccc';
                confirmBtn.style.pointerEvents = 'none';
                if (errorMsg) errorMsg.style.display = 'none';
                return;
            }

            if (amount > currentBal) {
                if (errorMsg) errorMsg.style.display = 'block';
                confirmBtn.style.background = '#ccc';
                confirmBtn.style.pointerEvents = 'none';
            } else {
                if (errorMsg) errorMsg.style.display = 'none';
                confirmBtn.style.background = 'var(--primary-color)';
                confirmBtn.style.pointerEvents = 'auto';
            }
        };

        const showPanel = () => {
            if (panel) panel.classList.add('active');
            if (backdrop) backdrop.classList.add('active');
            if (input) input.value = '';
            validateInput();
        };

        const hidePanel = () => {
            if (panel) panel.classList.remove('active');
            if (backdrop) backdrop.classList.remove('active');
        };

        if (triggerBtn) triggerBtn.onclick = showPanel;
        if (closePanelBtn) closePanelBtn.onclick = hidePanel;
        if (backdrop) backdrop.onclick = hidePanel;
        if (cancelBtn) cancelBtn.onclick = hidePanel;

        if (input) input.oninput = validateInput;

        if (withdrawAllBtn) {
            withdrawAllBtn.onclick = () => {
                if (input) {
                    input.value = MockData.user.balance || 0;
                    validateInput();
                }
            };
        }

        if (confirmBtn) {
            confirmBtn.onclick = () => {
                const amount = parseFloat(input.value);
                MockData.user.balance -= amount;

                const newTransaction = {
                    id: Date.now(),
                    amount: -amount,
                    type: 'expense',
                    label: '余额提现',
                    date: new Date().toISOString().split('T')[0]
                };
                if (!MockData.user.transactions) MockData.user.transactions = [];
                MockData.user.transactions.unshift(newTransaction);

                localStorage.setItem('cargoUserBalance', MockData.user.balance.toString());
                localStorage.setItem('cargoUserTransactions', JSON.stringify(MockData.user.transactions));

                if (successModal) {
                    successModal.style.display = 'flex';
                    if (successAmountDisplay) successAmountDisplay.textContent = `¥${amount.toFixed(2)}`;
                }
            };
        }

        const closeSuccess = () => {
            if (successModal) successModal.style.display = 'none';
            hidePanel();
            this.isBalanceVisible = true;
            this.renderWalletDetail();
        };

        if (closeSuccessBtn) closeSuccessBtn.onclick = closeSuccess;
        if (finishBtn) finishBtn.onclick = closeSuccess;
    }

    renderBankCards() {
        this.main.innerHTML = `
            <div class="bg-light" style="min-height: 100%;" >
                <header style="background: white; padding: 12px 16px; border-bottom: 1px solid var(--border-color); display: flex; align-items: center; gap: 12px;">
                    <span class="material-icons" onclick="app.navigate('walletDetail')" style="cursor: pointer; color: var(--text-main);">arrow_back_ios</span>
                    <h2 style="font-size: 18px; margin: 0; font-weight: bold; flex: 1; text-align: center;">银行卡管理</h2>
                    <span style="width: 24px;"></span>
                </header>

                <div class="container" style="padding-top: 16px;">
                    ${(MockData.user.bankCards || []).map(card => `
                    <div style="background: linear-gradient(135deg, #005596, #0076CE); border-radius: 12px; padding: 20px; color: white; margin-bottom: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); position: relative; overflow: hidden;">
                        <span class="material-icons" style="position: absolute; right: -20px; bottom: -24px; font-size: 120px; opacity: 0.1; color: white;">account_balance</span>
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px;">
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <div style="width: 44px; height: 44px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                    <span class="material-icons" style="color: #005596; font-size: 28px;">account_balance</span>
                                </div>
                                <div>
                                    <div style="font-size: 17px; font-weight: bold;">${card.bankName}</div>
                                    <div style="font-size: 13px; opacity: 0.9;">${card.cardType || '储蓄卡'}</div>
                                </div>
                            </div>
                            <span class="material-icons" onclick="app.removeBankCard(${card.id})" style="cursor: pointer; opacity: 0.8; font-size: 20px;">delete_outline</span>
                        </div>
                        <div style="font-size: 22px; letter-spacing: 4px; text-align: center; margin-bottom: 8px; font-family: monospace;">
                            **** **** **** ${card.cardNumber}
                        </div>
                    </div>
                    `).join('')}

                    <div class="card" onclick="app.navigate('addBankCard')" style="border: 2px dashed #ccc; background: #fff; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 140px; cursor: pointer; border-radius: 12px; margin-top: 20px;">
                        <span class="material-icons" style="font-size: 40px; color: #bbb; margin-bottom: 12px;">add_circle_outline</span>
                        <span style="color: #666; font-size: 15px; font-weight: 500;">添加银行卡</span>
                        <p style="font-size: 11px; color: #999; margin-top: 8px;">提现秒到账 支持主流银行</p>
                    </div>
                </div>
            </div>
            `;
    }

    renderAddBankCard() {
        this.main.innerHTML = `
            <div class="bg-light" style="min-height: 100%;" >
                <header style="background: white; padding: 12px 16px; border-bottom: 1px solid var(--border-color); display: flex; align-items: center; gap: 12px;">
                    <span class="material-icons" onclick="app.navigate('bankCards')" style="cursor: pointer; color: var(--text-main);">arrow_back_ios</span>
                    <h2 style="font-size: 18px; margin: 0; font-weight: bold; flex: 1; text-align: center;">添加银行卡</h2>
                    <span style="width: 24px;"></span>
                </header>

                <div class="container" style="padding-top: 16px;">
                    <div class="card" style="padding: 16px; background: #F0F9FF; border: 1px solid #BAE6FD; margin-bottom: 20px;">
                        <div style="font-size: 12px; color: #0369A1; display: flex; align-items: center; gap: 8px;">
                            <span class="material-icons" style="font-size: 16px;">info</span>
                            请务必填写本人的银行卡信息，以免影响资金到账
                        </div>
                    </div>

                    <div class="card" style="padding: 0;">
                        <div style="padding: 16px; border-bottom: 1px solid #f9f9f9;">
                            <label style="display: block; font-size: 14px; color: #666; margin-bottom: 8px;">持卡人姓名</label>
                            <input type="text" value="${MockData.user.name}" readonly style="width: 100%; border: none; font-size: 16px; font-weight: bold; color: #999; outline: none; background: transparent;">
                        </div>
                        <div style="padding: 16px; border-bottom: 1px solid #f9f9f9; position: relative;">
                            <label style="display: block; font-size: 14px; color: #666; margin-bottom: 8px;">选择银行</label>
                            <select id="bankNameSelect" style="position: absolute; top: 38px; left: 16px; width: calc(100% - 32px); height: 30px; opacity: 0; cursor: pointer; z-index: 2;" onchange="document.getElementById('displayBankName').textContent = this.value">
                                <option value="中国工商银行">中国工商银行</option>
                                <option value="中国建设银行">中国建设银行</option>
                                <option value="招商银行">招商银行</option>
                            </select>
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span id="displayBankName" style="font-size: 16px; color: #333;">中国工商银行</span>
                                <span class="material-icons" style="color: #ccc;">chevron_right</span>
                            </div>
                        </div>
                        <div style="padding: 16px;">
                            <label style="display: block; font-size: 14px; color: #666; margin-bottom: 8px;">银行卡号</label>
                            <input type="number" id="cardNumberInput" placeholder="请输入银行卡号" style="width: 100%; border: none; font-size: 16px; outline: none; background: transparent;">
                        </div>
                    </div>

                    <div style="padding: 32px 16px;">
                        <button class="btn btn-primary" onclick="app.saveBankCard()" style="background: var(--primary-color); height: 50px; border-radius: 25px; font-weight: bold; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);">确认添加</button>
                    </div>
                </div>
            </div>
            `;
    }

    saveBankCard() {
        const input = document.getElementById('cardNumberInput');
        if (!input) return;
        const cardNumberFull = input.value;
        if (cardNumberFull.length < 10) {
            alert('请输入正确的银行卡号');
            return;
        }
        const bankNameSelect = document.getElementById('bankNameSelect');
        const bankName = bankNameSelect ? bankNameSelect.value : "中国工商银行";
        const newCard = {
            id: Date.now(),
            bankName: bankName,
            cardType: '储蓄卡',
            cardNumber: cardNumberFull.slice(-4)
        };
        if (!MockData.user.bankCards) MockData.user.bankCards = [];
        MockData.user.bankCards.push(newCard);
        localStorage.setItem('cargoUserBankCards', JSON.stringify(MockData.user.bankCards));
        this.navigate('bankCards');
    }

    removeBankCard(id) {
        if (!confirm('确定要删除这张银行卡吗？')) return;
        MockData.user.bankCards = MockData.user.bankCards.filter(c => c.id !== id);
        localStorage.setItem('cargoUserBankCards', JSON.stringify(MockData.user.bankCards));
        this.renderBankCards();
    }

    toggleBalanceVisibility() {
        this.isBalanceVisible = !this.isBalanceVisible;
        const icon = document.getElementById('balance-visibility-icon');
        const display = document.getElementById('wallet-balance-display');
        if (icon) icon.textContent = this.isBalanceVisible ? 'visibility' : 'visibility_off';
        if (display) {
            display.innerHTML = `${this.isBalanceVisible ? (MockData.user.balance || 0).toFixed(2) : '******'} <span class="material-icons" style="font-size: 28px;">chevron_right</span>`;
        }
    }

    renderTransactionList() {
        const container = document.getElementById('transaction-list');
        if (!container) return;
        container.innerHTML = (MockData.user.transactions || []).map(item => {
            const isIncome = item.amount > 0;
            const amountColor = isIncome ? '#059669' : '#DC2626';
            const amountSign = isIncome ? '+' : '';
            return `
                <div style="padding: 16px; border-bottom: 1px solid #f9f9f9; display: flex; justify-content: space-between; align-items: flex-start;">
                    <div>
                        <div style="font-weight: bold; font-size: 16px; color: ${amountColor}; margin-bottom: 4px;">
                            ${amountSign}${item.amount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <div style="font-size: 13px; color: #666;">${item.label}</div>
                    </div>
                    <div style="font-size: 13px; color: #999; padding-top: 2px;">
                        ${item.date}
                    </div>
                </div>
            `;
        }).join('') || '<div style="padding: 40px; text-align: center; color: #999;">暂无记录</div>';
    }

    renderProfileItem(icon, label, value = '', viewId = '', isSpecial = false) {
        return `
            <div class="profile-item flex justify-between items-center" style="padding: 16px; border-bottom: 1px solid #f9f9f9; cursor: pointer;" 
                 ${viewId ? `data-target="${viewId}"` : ''}>
                <div class="flex items-center gap-3">
                    <div style="width: 36px; height: 36px; background: #f4f7fb; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                        <span class="material-icons" style="font-size: 20px; color: var(--primary-color);">${icon}</span>
                    </div>
                    <span style="font-size: 15px; color: #333; font-weight: 400;">${label}</span>
                </div>
                <div class="flex items-center gap-1">
                    <span style="font-size: 13px; color: ${isSpecial ? 'var(--orange-main)' : '#999'};">${value}</span>
                    <span class="material-icons" style="font-size: 18px; color: #ccc;">chevron_right</span>
                </div>
            </div>
            `;
    }

    renderProfileEdit() {
        const user = MockData.user;
        this.main.innerHTML = `
            <div class="bg-light" style="min-height: 100%;" >
                <header style="background: white; padding: 12px 16px; border-bottom: 1px solid var(--border-color); display: flex; align-items: center; gap: 12px;">
                    <span class="material-icons" id="back-to-profile" style="cursor: pointer; color: var(--text-secondary);">arrow_back</span>
                    <h2 style="font-size: 18px; margin: 0; flex: 1; text-align: center;">个人资料</h2>
                </header>

                <div class="container" style="padding-top: 12px;">
                    <div class="card" style="padding: 0;">
                        <div class="flex justify-between items-center" style="padding: 16px; border-bottom: 1px solid #f9f9f9;">
                            <span style="font-size: 15px; color: #333;">头像</span>
                            <img src="${user.avatar}" style="width: 48px; height: 48px; border-radius: 50%;">
                        </div>
                        <div class="flex justify-between items-center" style="padding: 16px; border-bottom: 1px solid #f9f9f9;">
                            <span style="font-size: 15px; color: #333;">昵称</span>
                            <span style="color: #666;">${user.name}</span>
                        </div>
                        <div class="flex justify-between items-center" style="padding: 16px;">
                            <span style="font-size: 15px; color: #333;">手机号</span>
                            <span style="color: #666;">${user.phone}</span>
                        </div>
                    </div>

                    <div style="margin: 20px 0 12px; font-weight: bold; font-size: 14px; color: var(--text-secondary);">认证中心</div>
                    
                    <div class="card" style="padding: 0;">
                        <div class="flex justify-between items-center profile-row-trigger" style="padding: 16px; border-bottom: 1px solid #f9f9f9; cursor: pointer;" id="id-verify-trigger">
                            <span style="font-size: 15px; color: #333;">身份认证</span>
                            <div class="flex items-center gap-1">
                                <span style="font-size: 14px; color: ${user.idStatus === '已认证' ? '#059669' : '#DC2626'}">${user.idStatus}</span>
                                <span class="material-icons" style="font-size: 18px; color: #ccc;">chevron_right</span>
                            </div>
                        </div>
                        <div class="flex justify-between items-center profile-row-trigger" style="padding: 16px; cursor: pointer;" id="enterprise-auth-trigger">
                            <span style="font-size: 15px; color: #333;">企业认证</span>
                            <div class="flex items-center gap-1">
                                <span style="font-size: 14px; color: ${user.companyStatus === '已验证' ? '#059669' : '#666'}">${user.companyStatus}</span>
                                <span class="material-icons" style="font-size: 18px; color: #ccc;">chevron_right</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;

        document.getElementById('back-to-profile').onclick = () => this.navigate('profile');
        document.getElementById('id-verify-trigger').onclick = () => this.navigate('identityVerify');
        document.getElementById('enterprise-auth-trigger').onclick = () => this.navigate('enterpriseAuth');
    }

    renderIdentityVerify() {
        const user = MockData.user;
        this.main.innerHTML = `
            <div class="bg-light" style="min-height: 100%; padding-bottom: 0;" >
                <header style="background: white; padding: 12px 16px; border-bottom: 1px solid var(--border-color); display: flex; align-items: center; gap: 12px;">
                    <span class="material-icons" id="back-to-profile-edit-from-id" style="cursor: pointer; color: var(--text-secondary);">arrow_back</span>
                    <h2 style="font-size: 18px; margin: 0; flex: 1; text-align: center;">实名认证</h2>
                </header>

                <div class="container" style="padding-top: 12px;">
                    <div class="card" style="margin-bottom: 16px; background: #FFF7ED; border: 1px solid #FFEDD5;">
                        <div style="font-size: 12px; color: #9A3412; line-height: 1.6;">
                            <span class="material-icons" style="font-size: 14px; vertical-align: middle;">info</span>
                            依据相关法规，发货前需完成实名认证。由于认证涉及资金安全，请务必填写本人真实信息。
                        </div>
                    </div>

                    <div class="card" style="padding: 0;">
                        <div class="form-group" style="padding: 16px; border-bottom: 1px solid #f9f9f9; margin-bottom: 0;">
                            <label class="form-label" style="font-size: 14px;">真实姓名</label>
                            <input type="text" id="id-name-input" class="form-input" style="border: none; padding: 4px 0;" placeholder="请输入您的真实姓名" value="${user.idName}">
                        </div>
                        <div class="form-group" style="padding: 16px; margin-bottom: 0;">
                            <label class="form-label" style="font-size: 14px;">身份证号</label>
                            <input type="text" id="id-number-input" class="form-input" style="border: none; padding: 4px 0;" placeholder="请输入您的18位身份证号" value="${user.idNumber}">
                        </div>
                    </div>

                    <div style="margin: 24px 0 12px; font-weight: bold; font-size: 15px;">身份证照片</div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                        <div style="aspect-ratio: 1.6; background: white; border: 1px dashed #ddd; border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px;">
                            <span class="material-icons" style="font-size: 32px; color: #999;">add_a_photo</span>
                            <span style="font-size: 12px; color: #999;">身份证人像面</span>
                        </div>
                        <div style="aspect-ratio: 1.6; background: white; border: 1px dashed #ddd; border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px;">
                            <span class="material-icons" style="font-size: 32px; color: #999;">add_a_photo</span>
                            <span style="font-size: 12px; color: #999;">身份证国徽面</span>
                        </div>
                    </div>
                </div>

                <div style="position: fixed; bottom: 0; left: 0; right: 0; padding: 12px 16px; background: white; border-top: 1px solid #eee;">
                    <button class="btn btn-primary" id="submit-id-verify" style="background: var(--primary-color); height: 48px; border-radius: 24px;">提交认证</button>
                </div>
            </div>
            `;

        document.getElementById('back-to-profile-edit-from-id').onclick = () => this.navigate('profile');
        document.getElementById('submit-id-verify').onclick = () => {
            const name = document.getElementById('id-name-input').value;
            const num = document.getElementById('id-number-input').value;
            if (!name || !num) {
                alert('请补全真实姓名和身份证号');
                return;
            }
            user.idName = name;
            user.idNumber = num;
            user.idStatus = '审核中';
            alert('认证提交成功，请耐心等待审核');
            this.navigate('profileEdit');
        };
    }

    renderEnterpriseAuth() {
        const user = MockData.user;
        this.main.innerHTML = `
            <div class="bg-light" style="min-height: 100%; padding-bottom: 0;" >
                <header style="background: white; padding: 12px 16px; border-bottom: 1px solid var(--border-color); display: flex; align-items: center; gap: 12px;">
                    <span class="material-icons" id="back-to-profile-edit-from-ent" style="cursor: pointer; color: var(--text-secondary);">arrow_back</span>
                    <h2 style="font-size: 18px; margin: 0; flex: 1; text-align: center;">企业认证</h2>
                </header>

                <div class="container" style="padding-top: 12px;">
                    <div class="card" style="padding: 0;">
                        <div class="form-group" style="padding: 16px; border-bottom: 1px solid #f9f9f9; margin-bottom: 0;">
                            <label class="form-label" style="font-size: 14px;">企业名称</label>
                            <input type="text" id="ent-name-input" class="form-input" style="border: none; padding: 4px 0;" placeholder="请输入营业执照上的企业全称" value="${user.companyName}">
                        </div>
                        <div class="form-group" style="padding: 16px; margin-bottom: 0;">
                            <label class="form-label" style="font-size: 14px;">统一社会信用代码</label>
                            <input type="text" id="ent-code-input" class="form-input" style="border: none; padding: 4px 0;" placeholder="请输入18位信用代码" value="${user.companyCode}">
                        </div>
                    </div>

                    <div style="margin: 24px 0 12px; font-weight: bold; font-size: 15px;">营业执照</div>
                    <div style="aspect-ratio: 1.4; background: white; border: 1px dashed #ddd; border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; margin-bottom: 20px;">
                        <span class="material-icons" style="font-size: 48px; color: #999;">add_a_photo</span>
                        <div style="text-align: center;">
                            <div style="font-size: 14px; color: #333; font-weight: bold;">上传营业执照</div>
                            <div style="font-size: 12px; color: #999; margin-top: 4px;">请确保文字清晰，四周边缘露出</div>
                        </div>
                    </div>
                </div>

                <div style="position: fixed; bottom: 0; left: 0; right: 0; padding: 12px 16px; background: white; border-top: 1px solid #eee;">
                    <button class="btn btn-primary" id="submit-ent-auth" style="background: var(--primary-color); height: 48px; border-radius: 24px;">提交并认证</button>
                </div>
            </div>
            `;

        document.getElementById('back-to-profile-edit-from-ent').onclick = () => this.navigate('profile');
        document.getElementById('submit-ent-auth').onclick = () => {
            const name = document.getElementById('ent-name-input').value;
            const code = document.getElementById('ent-code-input').value;
            if (!name || !code) {
                alert('请填写完整的企业信息');
                return;
            }
            user.companyName = name;
            user.companyCode = code;
            user.companyStatus = '待审核';
            alert('企业认证申请已提交');
            this.navigate('profileEdit');
        };
    }

    // --- Address & Time Pickers ---

    renderAddressPicker(type) {
        const title = type === 'load' ? '装货地址' : '卸货地址';
        const addr = type === 'load' ? this.shipForm.loadAddr : this.shipForm.unloadAddr;
        const activeColor = 'var(--primary-color)';

        this.main.innerHTML = `
            <div class="bg-light" style="min-height: 100%; padding-bottom: 0;" >
                <header style="background: white; padding: 12px 16px; border-bottom: 1px solid var(--border-color); display: flex; align-items: center; gap: 12px; position: sticky; top: 0; z-index: 100;">
                    <span class="material-icons" id="back-to-ship" style="cursor: pointer; color: var(--text-main);">arrow_back</span>
                    <h2 style="font-size: 18px; margin: 0; flex: 1; text-align: center; font-weight: bold;">${title}</h2>
                    <div id="map-trigger" style="display: flex; flex-direction: column; align-items: center; cursor: pointer; min-width: 48px;">
                        <span class="material-icons" style="font-size: 22px; color: #2E66FF;">location_on</span>
                        <span style="font-size: 10px; color: #2E66FF; font-weight: 500;">地图选点</span>
                    </div>
                </header>

                <div class="container" style="padding-top: 16px;">
                    <div class="card" style="padding: 16px; border-radius: 16px; background: white;">
                        <!-- City/District Selection trigger -->
                        <div id="location-trigger" class="flex items-center justify-between" style="padding-bottom: 12px; border-bottom: 1px solid #f5f5f5; cursor: pointer; margin-bottom: 16px;">
                            <span id="current-city-display" style="font-size: 16px; color: #333; font-weight: 500;">${addr.city}</span>
                            <span class="material-icons" style="font-size: 18px; color: #ccc;">chevron_right</span>
                        </div>

                        <!-- Address Basic Area (Gray) -->
                        <div style="background: #F8F9FA; border-radius: 12px; padding: 16px;">
                            <div style="margin-bottom: 8px;">
                                <input type="text" id="addr-name-input" value="${addr.name}" style="background: transparent; border: none; font-size: 20px; font-weight: bold; width: 100%; outline: none; padding: 0;" placeholder="地点名称">
                            </div>
                            <div style="margin-bottom: 8px;">
                                <input type="text" id="addr-detail-input" value="${addr.detail}" style="background: transparent; border: none; font-size: 14px; color: #666; width: 100%; outline: none; padding: 0;" placeholder="写下街道、楼层、门牌号等">
                            </div>
                            <div class="flex justify-start items-center" style="gap: 16px; margin-top: 4px;">
                                <span class="material-icons" style="color: #bbb; font-size: 20px; cursor: pointer;">mic</span>
                                <span class="material-icons" style="color: #bbb; font-size: 20px; cursor: pointer;" id="clear-addr">cancel</span>
                            </div>
                        </div>

                        <!-- Quick Action Footer -->
                        <div class="flex justify-between items-center mt-4">
                            <div id="btn-addr-book" class="flex items-center gap-1" style="font-size: 13px; color: #333; cursor: pointer;"><span class="material-icons" style="font-size: 18px;">book</span>地址簿</div>
                            <div id="btn-add-contact" class="flex items-center gap-1" style="font-size: 13px; color: #333; cursor: pointer;"><span class="material-icons" style="font-size: 18px;">person_add</span>添加联系人</div>
                            <div id="btn-smart-paste" class="flex items-center gap-1" style="font-size: 13px; color: #333; cursor: pointer;"><span class="material-icons" style="font-size: 18px;">qr_code_scanner</span>地址智能识别</div>
                        </div>
                    </div>

                    <!-- Contact Info Card (Separate White Card Above History) -->
                    <div style="margin-top: 12px; background: #fff; border-radius: 12px; padding: 16px; border: 1px solid #f0f0f0;">
                        <div style="display: flex; gap: 0; align-items: center;">
                            <div style="flex: 1;">
                                <input type="text" id="contact-name-input" value="${addr.contactName || ''}" style="background: transparent; border: none; font-size: 15px; color: #333; width: 100%; outline: none; padding: 4px 0;" placeholder="${type === 'load' ? '姓名' : '收货人姓名'}">
                            </div>
                            <div style="width: 1px; height: 18px; background: #eee; margin: 0 12px;"></div>
                            <div style="flex: 1.5;">
                                <input type="tel" id="contact-phone-input" value="${addr.contactPhone || ''}" style="background: transparent; border: none; font-size: 15px; color: #333; width: 100%; outline: none; padding: 4px 0;" placeholder="手机号">
                            </div>
                        </div>

                        <!-- Mic / Cancel Relocated for better UX -->

                    </div>

                    <div style="color: #999; font-size: 14px; margin: 24px 0 12px;">历史地址</div>
                    <div class="card" style="padding: 0; border-radius: 16px; overflow: hidden;">
                        ${[
                { name: '利金城科技工业园', detail: '广东省-深圳市-龙华区 吉华路58号', city: '深圳市 龙华区' },
                { name: '万科城', detail: '广东省-深圳市-龙岗区 坂田街道', city: '深圳市 龙岗区' },
                { name: '深圳北站', detail: '广东省-深圳市-龙华区 民治街道', city: '深圳市 龙华区' }
            ].map((item, i) => `
                            <div class="addr-history-item" data-name="${item.name}" data-detail="${item.detail}" data-city="${item.city}" style="padding: 16px; border-bottom: 1px solid #f5f5f5; display: flex; gap: 12px; align-items: flex-start; cursor: pointer;">
                                <span class="material-icons" style="color: #ccc; font-size: 20px;">history</span>
                                <div style="flex: 1;">
                                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                                        <span style="font-weight: bold; font-size: 16px; color: #333;">${item.name}</span>
                                        ${i === 0 ? '<span style="background: var(--primary-color); color: white; font-size: 10px; padding: 2px 6px; border-radius: 4px;">当前定位</span>' : ''}
                                    </div>
                                    <div style="font-size: 12px; color: #999;">${item.detail}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div style="position: fixed; bottom: 0; left: 0; right: 0; padding: 12px 16px; background: white; border-top: 1px solid #f0f0f0; z-index: 100;">
                    <button class="btn btn-primary" id="confirm-addr-btn" style="background: var(--primary-color); border-radius: 26px; height: 52px; font-weight: bold; font-size: 16px;">保存地址信息</button>
                </div>
            </div>
            `;

        document.getElementById('back-to-ship').onclick = () => this.navigate('ship');
        document.getElementById('map-trigger').onclick = () => this.navigate('mapPicker', { type });
        document.getElementById('location-trigger').onclick = () => this.renderLocationPicker(type);

        document.getElementById('clear-addr').onclick = () => {
            document.getElementById('addr-name-input').value = '';
            document.getElementById('addr-detail-input').value = '';
            document.getElementById('addr-name-input').focus();
        };

        document.getElementById('btn-addr-book').onclick = () => this.openAddressBook((addrData) => {
            document.getElementById('addr-name-input').value = addrData.name || '';
            document.getElementById('addr-detail-input').value = addrData.detail || '';
            document.getElementById('current-city-display').innerText = addrData.city || '';
            if (addrData.contactName || addrData.name) {
                document.getElementById('contact-name-input').value = addrData.contactName || addrData.name;
            }
            if (addrData.phone || addrData.contactPhone) {
                document.getElementById('contact-phone-input').value = addrData.phone || addrData.contactPhone;
            }
        });
        document.getElementById('btn-add-contact').onclick = () => {
            const nameVal = document.getElementById('contact-name-input').value;
            const phoneVal = document.getElementById('contact-phone-input').value;
            const cityVal = document.getElementById('current-city-display').innerText;
            const addrName = document.getElementById('addr-name-input').value;
            const addrDetail = document.getElementById('addr-detail-input').value;

            // Completeness check: If name, phone, city, or detail missing, do nothing as requested.
            if (!nameVal || !phoneVal || !cityVal || !addrName || !addrDetail) return;

            this.openAddContact({
                name: nameVal,
                phone: phoneVal,
                city: cityVal,
                detail: addrDetail,
                isFromPage: true
            }, (updated) => {
                // Sync back updated info to page fields
                document.getElementById('contact-name-input').value = updated.name;
                document.getElementById('contact-phone-input').value = updated.phone;
                document.getElementById('current-city-display').innerText = updated.city;
                document.getElementById('addr-detail-input').value = updated.detail;
            });
        };
        document.getElementById('btn-smart-paste').onclick = () => this.openSmartPaste((result) => {
            if (result.name) document.getElementById('contact-name-input').value = result.name;
            if (result.phone) document.getElementById('contact-phone-input').value = result.phone;
            if (result.detail) document.getElementById('addr-detail-input').value = result.detail;
            if (result.city) document.getElementById('current-city-display').innerText = result.city;
        });

        document.querySelectorAll('.addr-history-item').forEach(item => {
            item.onclick = () => {
                const name = item.dataset.name;
                const detail = item.dataset.detail;
                const city = item.dataset.city;
                document.getElementById('addr-name-input').value = name;
                document.getElementById('addr-detail-input').value = detail;
                document.getElementById('current-city-display').innerText = city;
                // Update contact defaults from history if needed? usually history might not have it in simple mock
                // for now just clear or keep
                addr.city = city;
            };
        });

        document.getElementById('confirm-addr-btn').onclick = () => {
            const name = document.getElementById('addr-name-input').value;
            const detail = document.getElementById('addr-detail-input').value;
            const city = document.getElementById('current-city-display').innerText;
            const contactName = document.getElementById('contact-name-input').value;
            const contactPhone = document.getElementById('contact-phone-input').value;

            if (type === 'load') {
                this.shipForm.loadAddr = { city, name, detail, contactName, contactPhone };
            } else {
                this.shipForm.unloadAddr = { city, name, detail, contactName, contactPhone };
            }
            this.navigate('ship');
        };
    }

    renderLocationPicker(type) {
        // More comprehensive regional data mock
        const provinces = ['广东省', '江苏省', '浙江省', '北京市', '上海市', '四川省', '湖南省'];
        const cities = {
            '广东省': ['深圳市', '广州市', '东莞市', '佛山市', '惠州市'],
            '江苏省': ['南京市', '苏州市', '无锡市', '常州市'],
            '浙江省': ['杭州市', '宁波市', '温州市', '嘉兴市'],
            '四川省': ['成都市', '绵阳市', '德阳市'],
            '湖南省': ['长沙市', '株洲市', '湘潭市']
        };
        const districts = {
            '深圳市': ['龙华区', '南山区', '福田区', '宝安区', '龙岗区', '罗湖区', '盐田区', '坪山区', '光明区'],
            '广州市': ['天河区', '越秀区', '海珠区', '白云区', '荔湾区', '番禺区', '花都区', '南沙区', '增城区'],
            '东莞市': ['莞城区', '南城区', '东城区', '万江区', '长安镇', '虎门镇'],
            '成都市': ['武侯区', '锦江区', '青羊区', '金牛区', '成华区', '龙泉驿区'],
            '长沙市': ['芙蓉区', '天心区', '岳麓区', '开福区', '雨花区', '望城区']
        };

        let selectedProv = '';
        let selectedCity = '';
        let selectedDist = '';

        const updatePickerUI = () => {
            const pickerContent = document.getElementById('picker-list-content');
            let items = [];
            let currentStep = 'prov';

            if (!selectedProv) {
                items = provinces;
                currentStep = 'prov';
            } else if (!selectedCity) {
                items = cities[selectedProv] || [];
                currentStep = 'city';
            } else {
                items = districts[selectedCity] || (selectedCity === '北京市' || selectedCity === '上海市' ? ['东城区', '西城区', '朝阳区', '徐汇区', '黄浦区'] : ['全境']);
                currentStep = 'dist';
            }

            pickerContent.innerHTML = items.map(item => `
                <div class="location-item" style="padding: 16px; border-bottom: 1px solid #f5f5f5; font-size: 15px; color: #333; cursor: pointer; transition: background 0.2s;" >
                    ${item}
                </div>
            `).join('');

            document.querySelectorAll('.location-item').forEach((itemNode, idx) => {
                itemNode.onclick = () => {
                    const val = items[idx];
                    if (currentStep === 'prov') {
                        selectedProv = val;
                        // For municipalities:
                        if (val === '北京市' || val === '上海市') {
                            selectedCity = val;
                        }
                    } else if (currentStep === 'city') {
                        selectedCity = val;
                    } else {
                        selectedDist = val;
                        // Selection finished
                        const fullCity = `${selectedCity} ${selectedDist}`;
                        document.getElementById('current-city-display').innerText = fullCity;
                        document.body.removeChild(overlay);
                        return;
                    }
                    updatePickerUI();
                };
            });

            document.getElementById('picker-nav').innerHTML = `
                <span style="color: ${!selectedProv ? 'var(--primary-color)' : '#333'}; font-weight: ${!selectedProv ? 'bold' : 'normal'}; cursor: pointer;" id="nav-prov">${selectedProv || '请选择省'}</span>
                ${selectedProv ? `
                    <span style="margin: 0 8px; color: #ccc;">/</span>
                    <span style="color: ${selectedProv && !selectedCity ? 'var(--primary-color)' : '#333'}; font-weight: ${selectedProv && !selectedCity ? 'bold' : 'normal'}; cursor: pointer;" id="nav-city">${selectedCity || '请选择市'}</span>
                ` : ''}
                ${selectedCity ? `
                    <span style="margin: 0 8px; color: #ccc;">/</span>
                    <span style="color: var(--primary-color); font-weight: bold; cursor: pointer;">请选择区</span>
                ` : ''}
            `;

            if (document.getElementById('nav-prov')) {
                document.getElementById('nav-prov').onclick = () => {
                    selectedProv = '';
                    selectedCity = '';
                    selectedDist = '';
                    updatePickerUI();
                };
            }
            if (document.getElementById('nav-city')) {
                document.getElementById('nav-city').onclick = () => {
                    selectedCity = '';
                    selectedDist = '';
                    updatePickerUI();
                };
            }
        };

        const overlay = document.createElement('div');
        overlay.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; flex-direction: column; justify-content: flex-end;';
        overlay.innerHTML = `
            <div style="background: white; border-radius: 16px 16px 0 0; max-height: 80%; display: flex; flex-direction: column;" >
                <div style="padding: 16px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f0f0f0;">
                    <span style="font-weight: bold; font-size: 16px;">选择地区</span>
                    <span class="material-icons" id="close-picker" style="cursor: pointer; color: #999;">close</span>
                </div>
                <div id="picker-nav" style="padding: 12px 16px; border-bottom: 1px solid #f5f5f5; font-size: 14px;"></div>
                <div id="picker-list-content" style="flex: 1; overflow-y: auto; padding-bottom: 20px;"></div>
            </div>
            `;
        document.body.appendChild(overlay);

        document.getElementById('close-picker').onclick = () => document.body.removeChild(overlay);
        updatePickerUI();
    }

    renderMapPicker(type) {
        const title = type === 'load' ? '装货点' : '卸货点';
        const activeColor = 'var(--primary-color)';

        this.main.innerHTML = `
            <div style="height: 100%; display: flex; flex-direction: column;" >
                <header style="background: white; padding: 12px 16px; border-bottom: 1px solid var(--border-color); display: flex; align-items: center; gap: 12px; z-index: 100;">
                    <span class="material-icons" id="back-to-addr" style="cursor: pointer; color: var(--text-secondary);">arrow_back</span>
                    <div class="search-container" style="flex: 1; margin: 0; background: #f0f0f0;">
                        <span style="font-size: 14px;">深圳市 龙华区</span>
                        <span class="material-icons" style="font-size: 16px;">arrow_drop_down</span>
                        <div style="width: 1px; height: 16px; background: #ccc; margin: 0 8px;"></div>
                        <input type="text" class="search-input" id="map-search-input" placeholder="利金城科技工业园" style="font-size: 14px;">
                        <span class="material-icons" id="clear-search" style="font-size: 20px; color: #999; cursor: pointer;">cancel</span>
                    </div>
                </header>

                <div id="google-map-container" style="width: 100%; height: 300px; background-color: #e5e7eb; position: relative;">
                    <!-- Map will be injected here -->
                </div>

                <div class="map-results-list" style="flex: 1; overflow-y: auto; background: white; border-top-left-radius: 16px; border-top-right-radius: 16px; margin-top: -16px; position: relative; z-index: 20; padding: 16px;">
                    ${[
                { name: '利金城科技工业园', detail: '吉华路58号', lat: 22.65, lng: 114.05 },
                { name: '利金城购物中心', detail: '布龙路与吉华路交汇处', lat: 22.648, lng: 114.052 },
                { name: '利金城宿舍', detail: '利金城科技园2栋', lat: 22.652, lng: 114.048 }
            ].map((item, i) => `
                        <div class="map-res-item ${i === 0 ? 'active' : ''}" data-name="${item.name}" data-detail="${item.detail}" data-lat="${item.lat}" data-lng="${item.lng}">
                            <div class="flex items-start gap-3">
                                <span class="material-icons" style="color: ${i === 0 ? activeColor : '#999'}; font-size: 20px;">location_on</span>
                                <div style="flex: 1;">
                                    <div class="res-name" style="font-weight: bold; font-size: 15px; color: ${i === 0 ? activeColor : '#333'};">${item.name}</div>
                                    <div class="res-detail" style="font-size: 12px; color: #999; margin-top: 4px;">${item.detail}</div>
                                </div>
                                ${i === 0 ? `<span class="material-icons" style="color: ${activeColor}; font-size: 20px;">check</span>` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div style="padding: 12px 16px; background: white; border-top: 1px solid #eee;">
                    <button class="btn btn-primary" id="set-point-btn" style="background: var(--primary-color); border-radius: 12px; height: 48px;">设为${title}</button>
                </div>
            </div>
            `;

        // Map Initialization Logic
        const initMap = () => {
            if (typeof google === 'undefined') {
                console.error("Google Maps API not loaded");
                return;
            }

            const center = { lat: 22.65, lng: 114.05 };
            const mapOptions = {
                zoom: 15,
                center: center,
                disableDefaultUI: true, // Clean look for mobile
                zoomControl: false,
                mapTypeControl: false,
                scaleControl: false,
                streetViewControl: false,
                rotateControl: false,
                fullscreenControl: false
            };

            const map = new google.maps.Map(document.getElementById('google-map-container'), mapOptions);

            const marker = new google.maps.Marker({
                position: center,
                map: map,
                icon: {
                    url: 'https://img.icons8.com/color/48/000000/marker.png',
                    scaledSize: new google.maps.Size(32, 32),
                    anchor: new google.maps.Point(16, 32)
                }
            });

            this.mapInstance = map;
            this.mapMarker = marker;
        };

        // Delay slightly if API is still loading, or call immediately
        setTimeout(initMap, 100);

        let selected = { name: '利金城科技工业园', detail: '吉华路58号' };

        document.getElementById('back-to-addr').onclick = () => this.navigate('addressPicker', { type });
        document.getElementById('clear-search').onclick = () => document.getElementById('map-search-input').value = '';

        document.querySelectorAll('.map-res-item').forEach(item => {
            item.onclick = () => {
                document.querySelectorAll('.map-res-item').forEach(el => {
                    el.classList.remove('active');
                    el.querySelector('.material-icons').style.color = '#999';
                    const check = el.querySelector('.material-icons:last-child');
                    if (check && check.innerText === 'check') check.remove();
                    el.querySelector('.res-name').style.color = '#333';
                });
                item.classList.add('active');
                item.querySelector('.material-icons').style.color = activeColor;
                item.querySelector('.res-name').style.color = activeColor;
                item.querySelector('.flex').insertAdjacentHTML('beforeend', `< span class="material-icons" style="color: ${activeColor}; font-size: 20px;" > check</span > `);

                selected = { name: item.dataset.name, detail: item.dataset.detail };

                // Update Map View
                if (this.mapInstance) {
                    const newPos = { lat: parseFloat(item.dataset.lat), lng: parseFloat(item.dataset.lng) };
                    this.mapInstance.panTo(newPos);
                    this.mapMarker.setPosition(newPos);
                }
            };
        });

        document.getElementById('set-point-btn').onclick = () => {
            if (type === 'load') {
                this.shipForm.loadAddr = { city: '深圳市 龙华区', ...selected };
            } else {
                this.shipForm.unloadAddr = { city: '深圳市 龙华区', ...selected };
            }
            this.navigate('addressPicker', { type });
        };
    }

    renderTimePicker(type) {
        const title = type === 'pickup' ? '装货时间' : '卸货时间';
        const isPickup = type === 'pickup';
        const activeColor = '#2E66FF';

        // Initial selected state
        let selDay = '今天';
        let selRange = '下午';
        let selStart = '13:00';
        let selEnd = '18:00';

        const updateDisplay = () => {
            const displayEl = document.getElementById('time-display-text');
            if (displayEl) {
                const rangeText = (selStart === '随时' || selStart === '') ? '' : selStart + '-';
                displayEl.innerHTML = `${selDay} ${selRange}${rangeText}${selEnd}前 ${isPickup ? '装货' : '卸货'} `;
            }
        };

        this.main.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; display: flex; flex-direction: column; background: rgba(0,0,0,0.5); z-index: 2000;" >
                <div style="flex: 1;" id="close-time-picker"></div>
                <div style="background: white; border-radius: 16px 16px 0 0; display: flex; flex-direction: column; animation: slideUp 0.3s ease-out;">
                    <header style="padding: 16px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f5f5f5;">
                        <h2 style="font-size: 18px; margin: 0; font-weight: bold;">${title}</h2>
                        <span class="material-icons" id="x-close-time" style="cursor: pointer; color: #999;">close</span>
                    </header>
                    
                    <div style="display: flex; height: 320px;">
                        <!-- Left: Day Tabs -->
                        <div class="time-day-tabs" style="width: 100px; background: #F8F9FA;">
                            <div class="day-tab active" data-val="今天" style="padding: 16px; text-align: center; cursor: pointer; font-size: 15px; font-weight: 500;">今天 ⛅</div>
                            <div class="day-tab" data-val="明天" style="padding: 16px; text-align: center; cursor: pointer; font-size: 15px;">明天 ☁️</div>
                            <div class="day-tab" data-val="后天" style="padding: 16px; text-align: center; cursor: pointer; font-size: 15px;">后天 ☀️</div>
                            <div class="day-tab" id="more-days-btn" style="padding: 16px; text-align: center; color: #999; font-size: 13px; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px;">
                                <span>更多</span>
                                <span class="material-icons" style="font-size: 18px;">expand_more</span>
                            </div>
                        </div>

                        <!-- Right: Time Selection -->
                        <div class="time-content" style="flex: 1; display: flex; flex-direction: column; padding: 16px;">
                            <div class="time-range-tabs" style="display: flex; gap: 8px; margin-bottom: 20px;">
                                <div class="range-tab" data-val="上午" style="flex: 1; text-align: center; padding: 8px 0; border: 1px solid #eee; border-radius: 20px; font-size: 14px; cursor: pointer;">上午</div>
                                <div class="range-tab active" data-val="下午" style="flex: 1; text-align: center; padding: 8px 0; border: 1px solid ${activeColor}; color: ${activeColor}; border-radius: 20px; font-size: 14px; cursor: pointer;">下午</div>
                                <div class="range-tab" data-val="晚上" style="flex: 1; text-align: center; padding: 8px 0; border: 1px solid #eee; border-radius: 20px; font-size: 14px; cursor: pointer;">晚上</div>
                            </div>

                            <div class="time-picker-columns" style="display: flex; flex: 1; overflow: hidden; position: relative; border-top: 1px solid #f5f5f5;">
                                <!-- Column: Start Time -->
                                <div class="time-wheel-col" id="start-time-wheel" style="flex: 1; overflow-y: scroll; scroll-snap-type: y mandatory; text-align: center; -ms-overflow-style: none; scrollbar-width: none;">
                                    <div style="padding: 100px 0;">
                                        <div class="time-slot" data-val="随时" style="height: 40px; line-height: 40px; scroll-snap-align: center; font-size: 16px; cursor: pointer; color: #999;">随时</div>
                                        ${Array.from({ length: 24 }, (_, i) => {
            const h = i.toString().padStart(2, '0') + ':00';
            return `<div class="time-slot" data-val="${h}" style="height: 40px; line-height: 40px; scroll-snap-align: center; font-size: 16px; cursor: pointer; color: #999;">${h}</div>`;
        }).join('')}
                                    </div>
                                </div>
                                
                                <div style="display: flex; align-items: center; color: #eee;">-</div>

                                <!-- Column: End Time -->
                                <div class="time-wheel-col" id="end-time-wheel" style="flex: 1; overflow-y: scroll; scroll-snap-type: y mandatory; text-align: center; -ms-overflow-style: none; scrollbar-width: none;">
                                    <div style="padding: 100px 0;">
                                        ${Array.from({ length: 24 }, (_, i) => {
            const h = i.toString().padStart(2, '0') + ':00';
            return `<div class="time-slot" data-val="${h}" style="height: 40px; line-height: 40px; scroll-snap-align: center; font-size: 16px; cursor: pointer; color: #999;">${h}</div>`;
        }).join('')}
                                        <div class="time-slot" data-val="24:00" style="height: 40px; line-height: 40px; scroll-snap-align: center; font-size: 16px; cursor: pointer; color: #999;">24:00</div>
                                    </div>
                                </div>
                                <!-- Overlay Selection Bar -->
                                <div style="position: absolute; top: 100px; left: 0; width: 100%; height: 40px; background: rgba(46,102,255,0.05); pointer-events: none; border-top: 1px solid #f0f0f0; border-bottom: 1px solid #f0f0f0;"></div>
                            </div>
                        </div>
                    </div>

                    <div style="padding: 24px 16px; background: white; text-align: center; border-top: 1px solid #f5f5f5;">
                        <div style="font-weight: bold; font-size: 19px; margin-bottom: 20px; color: #333;" id="time-display-text"></div>
                        <button class="btn btn-primary" id="confirm-time-btn" style="background: #FFA940; border-radius: 26px; height: 52px; font-weight: bold; width: 100%; font-size: 18px; box-shadow: 0 4px 12px rgba(255, 169, 64, 0.3);">确 定</button>
                    </div>
                </div>

                <input type="date" id="native-date-picker" style="position: absolute; visibility: hidden; pointer-events: none;">
            </div>
        `;

        const close = () => this.navigate('ship');
        document.getElementById('close-time-picker').onclick = close;
        document.getElementById('x-close-time').onclick = close;

        const updateWheelSelection = (wheelId, val) => {
            const wheel = document.getElementById(wheelId);
            const slots = wheel.querySelectorAll('.time-slot');
            let foundIdx = -1;
            slots.forEach((s, i) => {
                if (s.dataset.val === val) foundIdx = i;
            });
            if (foundIdx !== -1) {
                wheel.scrollTop = foundIdx * 40;
                slots.forEach(s => {
                    s.style.color = '#999';
                    s.style.fontWeight = 'normal';
                });
                slots[foundIdx].style.color = activeColor;
                slots[foundIdx].style.fontWeight = 'bold';
            }
        };

        // Day Selection
        document.querySelectorAll('.day-tab[data-val]').forEach(tab => {
            tab.onclick = () => {
                document.querySelectorAll('.day-tab').forEach(t => {
                    t.classList.remove('active');
                    t.style.background = 'transparent';
                    t.style.fontWeight = 'normal';
                });
                tab.classList.add('active');
                tab.style.background = 'white';
                tab.style.fontWeight = 'bold';
                selDay = tab.dataset.val;
                updateDisplay();
            };
        });

        // Range Selection
        document.querySelectorAll('.range-tab').forEach(tab => {
            tab.onclick = () => {
                document.querySelectorAll('.range-tab').forEach(t => {
                    t.classList.remove('active');
                    t.style.borderColor = '#eee';
                    t.style.color = '#333';
                });
                tab.classList.add('active');
                tab.style.borderColor = activeColor;
                tab.style.color = activeColor;
                selRange = tab.dataset.val;

                // Auto choose time slots based on range
                if (selRange === '上午') {
                    selStart = '06:00'; selEnd = '12:00';
                } else if (selRange === '下午') {
                    selStart = '12:00'; selEnd = '18:00';
                } else if (selRange === '晚上') {
                    selStart = '18:00'; selEnd = '24:00';
                }
                updateWheelSelection('start-time-wheel', selStart);
                updateWheelSelection('end-time-wheel', selEnd);
                updateDisplay();
            };
        });

        // "More" Button - Show native calendar
        const moreBtn = document.getElementById('more-days-btn');
        const nativePicker = document.getElementById('native-date-picker');
        moreBtn.onclick = () => {
            nativePicker.showPicker ? nativePicker.showPicker() : nativePicker.click();
        };

        nativePicker.onchange = (e) => {
            const date = new Date(e.target.value);
            selDay = `${date.getMonth() + 1}月${date.getDate()} 日`;
            document.querySelectorAll('.day-tab').forEach(t => {
                t.classList.remove('active');
                t.style.background = 'transparent';
                t.style.fontWeight = 'normal';
            });
            moreBtn.innerHTML = `< span > ${selDay}</span > <span class="material-icons" style="font-size: 18px;">expand_more</span>`;
            moreBtn.classList.add('active'); // Keep active style
            moreBtn.style.background = 'white';
            moreBtn.style.fontWeight = 'bold';
            updateDisplay();
        };

        // Wheel Selection logic
        const wheels = ['start-time-wheel', 'end-time-wheel'];
        wheels.forEach(id => {
            const wheel = document.getElementById(id);
            wheel.onscroll = () => {
                clearTimeout(wheel.scrollTimeout);
                wheel.scrollTimeout = setTimeout(() => {
                    const scrollY = wheel.scrollTop;
                    const index = Math.round(scrollY / 40);
                    const slots = wheel.querySelectorAll('.time-slot');
                    const selectedSlot = slots[index];

                    slots.forEach(s => {
                        s.style.color = '#999';
                        s.style.fontWeight = 'normal';
                    });
                    if (selectedSlot) {
                        selectedSlot.style.color = activeColor;
                        selectedSlot.style.fontWeight = 'bold';
                        if (id === 'start-time-wheel') selStart = selectedSlot.dataset.val;
                        else selEnd = selectedSlot.dataset.val;
                        updateDisplay();
                    }
                }, 100);
            };
        });

        // Set Initial positions
        updateWheelSelection('start-time-wheel', selStart);
        updateWheelSelection('end-time-wheel', selEnd);

        // Set initial range tab active style
        document.querySelectorAll('.range-tab').forEach(t => {
            if (t.dataset.val === selRange) {
                t.classList.add('active');
                t.style.borderColor = activeColor;
                t.style.color = activeColor;
            } else {
                t.classList.remove('active');
                t.style.borderColor = '#eee';
                t.style.color = '#333';
            }
        });

        document.getElementById('confirm-time-btn').onclick = () => {
            const rangeText = (selStart === '随时' || selStart === '') ? '' : selStart + '-';
            const finalTime = `${selDay} ${selRange}${rangeText}${selEnd} 前`;
            if (isPickup) this.shipForm.pickupTime = finalTime;
            else this.shipForm.deliveryTime = finalTime;
            this.navigate('ship');
        };

        updateDisplay();
    }

    // --- Components ---

    renderQuickAction(icon, label, target, bgColor = '#f4f7fb', iconColor = 'var(--primary-color)') {
        return `
            <div class="quick-action" data - target="${target}" style="display: flex; flex-direction: column; align-items: center; cursor: pointer;" >
                <div style="width: 48px; height: 48px; background: ${bgColor}; border-radius: 14px; display: flex; align-items: center; justify-content: center; margin-bottom: 8px;">
                    <span class="material-icons" style="color: ${iconColor}; font-size: 28px;">${icon}</span>
                </div>
                <span style="font-size: 12px; color: #4B5563; font-weight: 500;">${label}</span>
            </div>
            `;
    }

    renderWaybillCard(wb) {
        let statusColor = 'var(--primary-color)';
        if (wb.status === '待装货') statusColor = 'var(--primary-color)';
        if (wb.status === '运输中') statusColor = 'var(--primary-color)';
        if (wb.status === '已签收') statusColor = '#999';

        return `
            <div class="card" onclick = "app.navigate('waybillDetail', { id: '${wb.id}' })" style="padding: 16px; margin-bottom: 16px; position: relative; cursor: pointer;" >
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; font-size: 13px; color: #999; border-bottom: 1px solid #f9f9f9; padding-bottom: 12px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span class="material-icons" style="font-size: 16px; color: #ccc;">assignment</span>
                        <span>运单号：${wb.id}</span>
                    </div>
                    <span style="color: ${statusColor}; font-weight: 600;">${wb.status}</span>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                    <div style="display: flex; align-items: center; gap: 12px; flex: 1;">
                        <div style="font-size: 18px; font-weight: bold; color: #333;">${wb.origin}</div>
                        <div style="display: flex; flex-direction: column; align-items: center;">
                            <span style="font-size: 10px; color: #999;">${wb.driver ? '运输中' : '待指派'}</span>
                            <div style="width: 40px; height: 1px; background: #eee; position: relative; margin: 4px 0;">
                                <div style="position: absolute; right: 0; top: -2px; width: 5px; height: 5px; border-top: 1px solid #ddd; border-right: 1px solid #ddd; transform: rotate(45deg);"></div>
                            </div>
                        </div>
                        <div style="font-size: 18px; font-weight: bold; color: #333;">${wb.destination}</div>
                    </div>
                    <div style="text-align: right; font-size: 15px; font-weight: 500; color: #333;">
                        ${wb.cargo} ${wb.weight}
                    </div>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; font-size: 13px; color: #666; background: #f9fbfc; padding: 10px; border-radius: 8px;">
                    <div style="display: flex; align-items: center; gap: 6px;">
                        <span class="material-icons" style="font-size: 16px; color: #999;">person</span>
                        <span>${wb.driver || '待派司机'}</span>
                        <span style="color: #ccc; margin: 0 4px;">|</span>
                        <span>${wb.plate || '广A·*****'}</span>
                    </div>
                    <div style="color: #999; font-size: 12px;">${wb.date}</div>
                </div>
            </div>
            `;
    }

    renderWaybillDetail(params) {
        const wb = MockData.waybills.find(w => w.id === params.id) || MockData.waybills[0];
        const form = this.shipForm; // Using form data as fallback/detail context as requested

        this.main.innerHTML = `
            <div class="bg-light" style="min-height: 100%; padding-bottom: 0;" >
                <header style="background: white; padding: 12px 16px; border-bottom: 1px solid var(--border-color); display: flex; align-items: center; gap: 12px; position: sticky; top: 0; z-index: 100;">
                    <span class="material-icons" onclick="app.navigate('waybills')" style="cursor: pointer; color: var(--text-main);">arrow_back_ios</span>
                    <h2 style="font-size: 18px; margin: 0; font-weight: bold; flex: 1; text-align: center;">运单详情</h2>
                    <span class="material-icons" style="color: var(--primary-color);">share</span>
                </header>

                <div class="container" style="padding-top: 16px;">
                    <!-- Status Header Card -->
                    <div class="card" style="background: linear-gradient(135deg, var(--primary-color), #3b82f6); color: white; padding: 24px; position: relative; overflow: hidden;">
                        <span class="material-icons" style="position: absolute; right: -20px; bottom: -24px; font-size: 120px; opacity: 0.1;">local_shipping</span>
                        <div style="font-size: 20px; font-weight: bold; margin-bottom: 8px; display: flex; align-items: center; gap: 8px;">
                            ${wb.status}
                        </div>
                        <div style="font-size: 13px; opacity: 0.9;">运单号：${wb.id}</div>
                    </div>

                    <!-- Transport Info -->
                    <div class="card" style="padding: 20px; margin-top: -10px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                            <div style="text-align: center; flex: 1;">
                                <div style="font-size: 20px; font-weight: bold; color: #333; margin-bottom: 4px;">${wb.origin}</div>
                                <div style="font-size: 12px; color: #999;">${form.loadAddr.name || '发货地'}</div>
                            </div>
                            <div style="flex: 1; text-align: center; position: relative;">
                                <div style="font-size: 12px; color: var(--primary-color); margin-bottom: 4px;">运输中</div>
                                <div style="height: 1px; background: #eee; position: relative;">
                                    <span class="material-icons" style="position: absolute; left: 50%; top: -10px; transform: translateX(-50%); font-size: 20px; color: var(--primary-color); background: white;">local_shipping</span>
                                </div>
                            </div>
                            <div style="text-align: center; flex: 1;">
                                <div style="font-size: 20px; font-weight: bold; color: #333; margin-bottom: 4px;">${wb.destination}</div>
                                <div style="font-size: 12px; color: #999;">${form.unloadAddr.name || '收货地'}</div>
                            </div>
                        </div>
                        
                        <div style="background: #f8fafc; border-radius: 8px; padding: 12px; display: flex; align-items: center; gap: 12px;">
                            <div style="width: 40px; height: 40px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                                <span class="material-icons" style="color: #666;">person</span>
                            </div>
                            <div style="flex: 1;">
                                <div style="font-weight: bold; color: #333;">${wb.driver} <span style="font-weight: normal; color: #999; font-size: 12px; margin-left: 8px;">${wb.plate}</span></div>
                                <div style="font-size: 12px; color: #666; margin-top: 2px;">电话：139****8888</div>
                            </div>
                            <div style="display: flex; gap: 12px;">
                                <div style="width: 32px; height: 32px; background: #dcfce7; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #16a34a;">
                                    <span class="material-icons" style="font-size: 18px;">phone</span>
                                </div>
                                <div style="width: 32px; height: 32px; background: #e0f2fe; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #0284c7;">
                                    <span class="material-icons" style="font-size: 18px;">chat</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Details Section (Filled Data) -->
                    <div style="margin: 20px 0 8px; padding-left: 4px; font-size: 14px; color: #666; font-weight: bold;">货物及发布信息</div>
                    <div class="card" style="padding: 0;">
                        <div style="padding: 16px; border-bottom: 1px solid #f9f9f9; display: flex; justify-content: space-between;">
                            <span style="color: #999;">货物名称</span>
                            <span style="color: #333; font-weight: 500;">${form.cargoName || wb.cargo}</span>
                        </div>
                        <div style="padding: 16px; border-bottom: 1px solid #f9f9f9; display: flex; justify-content: space-between;">
                            <span style="color: #999;">重量/体积</span>
                            <span style="color: #333; font-weight: 500;">${form.weight || wb.weight} / ${form.volume || '0'}方</span>
                        </div>
                        <div style="padding: 16px; border-bottom: 1px solid #f9f9f9; display: flex; justify-content: space-between;">
                            <span style="color: #999;">车型要求</span>
                            <span style="color: #333; font-weight: 500;">${form.vehicleLength}米 ${form.vehicleType}</span>
                        </div>
                        <div style="padding: 16px; border-bottom: 1px solid #f9f9f9; display: flex; justify-content: space-between;">
                            <span style="color: #999;">装货时间</span>
                            <span style="color: #333; font-weight: 500;">${form.pickupTime}</span>
                        </div>
                        <div style="padding: 16px; border-bottom: 1px solid #f9f9f9; display: flex; justify-content: space-between;">
                            <span style="color: #999;">发票信息</span>
                            <span style="color: #333; font-weight: 500;">${form.invoiceType}</span>
                        </div>
                        <div style="padding: 16px; display: flex; justify-content: space-between;">
                            <span style="color: #999;">备注说明</span>
                            <span style="color: #333; font-weight: 500;">${form.notes.join(', ') || '无'}</span>
                        </div>
                    </div>

                    <!-- Track info -->
                    <div style="margin: 20px 0 8px; padding-left: 4px; font-size: 14px; color: #666; font-weight: bold;">物流轨迹</div>
                    <div class="card" style="padding: 20px;">
                        ${this.renderTrackingSteps(wb.status, wb.date)}
                    </div>
                </div>

            </div>
        `;
    }

    renderTrackingSteps(currentKind, date) {
        // Define all possible steps in order
        const allSteps = [
            { id: '未接单', title: '订单已创建', desc: '等待司机接单' },
            { id: '已接单', title: '司机已接单', desc: '司机正赶往装货地' },
            { id: '待装货', title: '司机已到达', desc: '等待装货中' },
            { id: '运输中', title: '运输中', desc: '包裹正在运输途中' },
            { id: '已签收', title: '已签收', desc: '客户已签收' },
            { id: '已回单', title: '已回单', desc: '回单已上传' },
            { id: '已结算', title: '已结算', desc: '运费已结算' },
            { id: '已取消', title: '已取消', desc: '订单已取消' }
        ];

        // Find index of current status
        let currentIndex = allSteps.findIndex(s => s.id === currentKind);
        if (currentIndex === -1) currentIndex = 0; // Default to first if unknown

        let displaySteps = [];
        if (currentKind === '已取消') {
            displaySteps = [
                { id: '未接单', title: '订单已创建', desc: '您已发布运单', time: date + ' 10:00:00' },
                { id: '已取消', title: '已取消', desc: '订单已取消', time: date + ' 10:05:00' }
            ];
            currentIndex = 1;
        } else {
            displaySteps = allSteps.slice(0, currentIndex + 1).reverse(); // Show latest first
        }

        return displaySteps.map((step, i) => {
            const isLatest = i === 0;
            const isLast = i === displaySteps.length - 1;

            // Mock times based on date
            // Latest is now, previous are hours ago
            const time = step.time || (isLatest ? new Date().toLocaleString() : date + ' 12:00:00');

            return `
                <div style="display: flex; gap: 16px;">
                    <div style="display: flex; flex-direction: column; align-items: center;">
                        <div style="width: ${isLatest ? '12px' : '10px'}; height: ${isLatest ? '12px' : '10px'}; background: ${isLatest ? 'var(--primary-color)' : '#ddd'}; border-radius: 50%; ${isLatest ? 'box-shadow: 0 0 0 4px rgba(37,99,235,0.1);' : ''}"></div>
                        ${!isLast ? '<div style="width: 2px; flex: 1; background: #f0f0f0; margin: 4px 0;"></div>' : ''}
                    </div>
                    <div style="padding-bottom: ${isLast ? '0' : '24px'};">
                        <div style="color: ${isLatest ? '#333' : '#666'}; font-weight: ${isLatest ? 'bold' : 'normal'}; font-size: 14px;">${step.title}</div>
                        <div style="color: #999; font-size: 12px; margin-top: 4px;">${step.desc}</div>
                        <div style="color: #ccc; font-size: 11px; margin-top: 4px;">${time}</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderFrequentRoutes() {
        this.main.innerHTML = `
            <div class="bg-light" style="min-height: 100%;">
                <header style="background: white; padding: 12px 16px; border-bottom: 1px solid var(--border-color); display: flex; align-items: center; gap: 12px; position: sticky; top: 0; z-index: 100;">
                    <span class="material-icons" onclick="app.navigate('profile')" style="cursor: pointer; color: var(--text-main);">arrow_back</span>
                    <h2 style="font-size: 18px; margin: 0; font-weight: bold; flex: 1; text-align: center;">常发路线</h2>
                    <div style="width: 24px;"></div> 
                </header>

                <div class="container" style="padding-top: 16px;">
                     ${MockData.frequentRoutes.map(route => `
                        <div class="card" style="padding: 16px; margin-bottom: 12px; position: relative;">
                            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                                <div style="display: flex; align-items: center; gap: 12px; font-size: 18px; font-weight: bold; color: #333;">
                                    <span>${route.origin}</span>
                                    <span class="material-icons" style="color: #ddd; font-size: 20px;">arrow_forward</span>
                                    <span>${route.destination}</span>
                                </div>
                                <div style="padding: 2px 8px; background: #E6F7FF; color: var(--primary-color); border-radius: 4px; font-size: 13px; font-weight: 500;">
                                    ${route.frequency}次
                                </div>
                            </div>
                            
                            <div style="display: flex; gap: 8px; margin-bottom: 20px;">
                                <span style="background: #f5f5f5; color: #666; padding: 4px 8px; border-radius: 4px; font-size: 12px;">${route.cargoName}</span>
                                <span style="background: #f5f5f5; color: #666; padding: 4px 8px; border-radius: 4px; font-size: 12px;">${route.vehicleDisplay}</span>
                            </div>

                            <button class="btn" style="width: 100%; border: 1px solid var(--primary-color); color: var(--primary-color); background: white; height: 40px; border-radius: 20px; font-size: 15px; font-weight: 500;" onclick="app.navigate('ship')">
                                再发一单
                            </button>
                        </div>
                     `).join('')}
                     
                     <div style="text-align: center; margin-top: 40px;">
                        <div style="margin-bottom: 16px; color: #999; font-size: 14px;">没有更多路线了</div>
                        <button class="btn" style="width: auto; padding: 0 32px; height: 44px; border-radius: 22px; font-size: 16px; background: #FFA940; color: white; border: none; box-shadow: 0 4px 12px rgba(255, 169, 64, 0.3);" onclick="app.navigate('ship')">新增发布</button>
                     </div>
                </div>
            </div>
        `;
    }

    openAddressBook(callback) {
        const overlay = document.createElement('div');
        overlay.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 2000; display: flex; flex-direction: column; justify-content: flex-end;';

        const listHtml = MockData.addressBook && MockData.addressBook.length ? MockData.addressBook.map((item, i) => `
            <div class="addr-book-item" data-idx="${i}" style="padding: 16px; border-bottom: 1px solid #f5f5f5; cursor: pointer;">
                <div style="font-weight: bold; font-size: 16px; margin-bottom: 4px;">${item.name} <span style="font-weight: normal; color: #666; font-size: 14px; margin-left: 8px;">${item.phone}</span></div>
                <div style="color: #999; font-size: 13px;">${item.city} ${item.detail}</div>
            </div>
        `).join('') : '<div style="padding: 32px; text-align: center; color: #999;">暂无联系人</div>';

        overlay.innerHTML = `
            <div style="background: white; border-radius: 16px 16px 0 0; max-height: 80%; display: flex; flex-direction: column;">
                <div style="padding: 16px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f0f0f0;">
                    <span style="font-weight: bold; font-size: 16px;">地址簿</span>
                    <span class="material-icons" id="close-addr-book" style="cursor: pointer; color: #999;">close</span>
                </div>
                <div style="flex: 1; overflow-y: auto; padding-bottom: 20px;">
                    ${listHtml}
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        document.getElementById('close-addr-book').onclick = () => document.body.removeChild(overlay);

        overlay.querySelectorAll('.addr-book-item').forEach(el => {
            el.onclick = () => {
                const idx = el.dataset.idx;
                const item = MockData.addressBook[idx];
                callback(item);
                document.body.removeChild(overlay);
            };
        });
    }

    openAddContact(initData = {}, syncCallback = null) {
        const overlay = document.createElement('div');
        overlay.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); z-index: 2000; display: flex; flex-direction: column; justify-content: center; padding: 24px; backdrop-filter: blur(2px);';

        const name = initData.name || '';
        const phone = initData.phone || '';
        const city = initData.city || '城市 (如: 深圳市 龙华区)';
        const cityColor = (initData.city && !initData.city.includes('城市')) ? '#333' : '#9CA3AF';
        const detail = initData.detail || '';

        overlay.innerHTML = `
            <div style="background: white; border-radius: 20px; padding: 32px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); transform: translateY(-20px);">
                <h3 style="margin: 0 0 24px; text-align: center; font-size: 20px; color: #1F2937; font-weight: bold;">确认添加联系人</h3>
                <div style="display: flex; flex-direction: column; gap: 16px;">
                    <input type="text" id="new-name" placeholder="姓名" class="form-input" value="${name}" style="height: 52px; border-radius: 12px; border: 1px solid #E5E7EB; font-size: 15px; padding: 0 16px;">
                    <input type="tel" id="new-phone" placeholder="电话" class="form-input" value="${phone}" style="height: 52px; border-radius: 12px; border: 1px solid #E5E7EB; font-size: 15px; padding: 0 16px;">
                    <div id="new-location-trigger" style="height: 52px; border-radius: 12px; border: 1px solid #E5E7EB; font-size: 15px; padding: 0 16px; display: flex; align-items: center; justify-content: space-between; color: ${cityColor}; cursor: pointer;">
                        <span id="new-city-val">${city}</span>
                        <span class="material-icons" style="font-size: 20px; color: #999;">keyboard_arrow_down</span>
                    </div>
                    <input type="text" id="new-detail" placeholder="详细地址" class="form-input" value="${detail}" style="height: 52px; border-radius: 12px; border: 1px solid #E5E7EB; font-size: 15px; padding: 0 16px;">
                </div>
                <div style="display: flex; gap: 12px; margin-top: 32px;">
                    <button id="cancel-add" class="btn" style="flex: 1; height: 52px; border-radius: 26px; background: #F3F4F6; color: #4B5563; font-weight: 500; font-size: 16px; border: none;">取消</button>
                    <button id="confirm-add" class="btn btn-primary" style="flex: 1; height: 52px; border-radius: 26px; background: #FFA940; color: white; font-weight: 500; font-size: 16px; border: none; box-shadow: 0 4px 12px rgba(255,169,64,0.3);">确定保存</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        document.getElementById('new-location-trigger').onclick = () => {
            // Re-use logic for picking city but update this specific field
            const provs = ['广东省', '江苏省', '浙江省'];
            const cts = { '广东省': ['深圳市', '广州市'], '江苏省': ['南京市'], '浙江省': ['杭州市'] };
            const dsts = {
                '深圳市': ['龙华区', '南山区'],
                '广州市': ['天河区', '越秀区'],
                '南京市': ['玄武区', '秦淮区'],
                '杭州市': ['西湖区', '上城区']
            };

            const locPicker = document.createElement('div');
            locPicker.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.4); z-index: 3000; display: flex; flex-direction: column; justify-content: flex-end;';
            locPicker.innerHTML = `
                <div style="background: white; border-radius: 16px 16px 0 0; padding: 20px;">
                    <div style="padding-bottom: 12px; font-weight: bold; text-align: center;">选择城市</div>
                    <div id="temp-list" style="max-height: 300px; overflow-y: auto;"></div>
                </div>
             `;
            document.body.appendChild(locPicker);

            const updateTemp = (level, val) => {
                const list = document.getElementById('temp-list');
                let items = level === 'p' ? provs : (level === 'c' ? cts[val] : dsts[val]);
                list.innerHTML = items.map(it => `<div class="temp-it" style="padding: 16px; border-bottom: 1px solid #eee;">${it}</div>`).join('');
                list.querySelectorAll('.temp-it').forEach((node, i) => {
                    node.onclick = () => {
                        if (level === 'p') updateTemp('c', items[i]);
                        else if (level === 'c') updateTemp('d', items[i]);
                        else {
                            document.getElementById('new-city-val').innerText = items[i];
                            document.getElementById('new-city-val').style.color = '#333';
                            document.body.removeChild(locPicker);
                        }
                    }
                });
            }
            updateTemp('p');
        };

        document.getElementById('cancel-add').onclick = () => document.body.removeChild(overlay);
        document.getElementById('confirm-add').onclick = () => {
            const name = document.getElementById('new-name').value;
            const phone = document.getElementById('new-phone').value;
            const city = document.getElementById('new-city-val').innerText;
            const detail = document.getElementById('new-detail').value;

            if (!name || !phone || city.includes('城市')) { alert('请填写完整信息'); return; }

            MockData.addressBook.push({ name, phone, city, detail });

            if (syncCallback) {
                syncCallback({ name, phone, city, detail });
            }

            alert('已成功保存至地址簿');
            document.body.removeChild(overlay);
        };
    }

    openSmartPaste(callback) {
        const overlay = document.createElement('div');
        overlay.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 2000; display: flex; flex-direction: column; justify-content: flex-end;';

        overlay.innerHTML = `
            <div style="background: white; border-radius: 16px 16px 0 0; padding: 20px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 16px;">
                    <span style="font-weight: bold;">智能识别</span>
                    <span class="material-icons" id="close-smart" style="cursor: pointer;">close</span>
                </div>
                <textarea id="smart-text" style="width: 100%; height: 100px; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px; margin-bottom: 16px;" placeholder="粘贴整段文字，如：王小明，13800138000，深圳市龙华区民治大道100号"></textarea>
                <button id="do-smart" class="btn btn-primary" style="width: 100%;">识别并填入</button>
            </div>
        `;
        document.body.appendChild(overlay);

        document.getElementById('close-smart').onclick = () => document.body.removeChild(overlay);
        document.getElementById('do-smart').onclick = () => {
            const text = document.getElementById('smart-text').value;
            if (!text) return;

            // Simple Logic
            let name = '', phone = '', detail = '', city = '';

            // Extract Phone
            const phoneMatch = text.match(/(1[3-9]\d{9})/);
            if (phoneMatch) {
                phone = phoneMatch[0];
            }

            // Remove phone from text
            let remaining = text.replace(phone, '').replace(/[,，\s]+/g, ' ').trim();

            // Heuristic spllit
            const parts = remaining.split(' ');
            if (parts.length >= 2) {
                name = parts[0];
                detail = parts.slice(1).join('');
            } else {
                detail = remaining;
            }

            // Extract City (Simple check)
            if (detail.includes('深圳市')) city = '深圳市';
            else if (detail.includes('广州市')) city = '广州市';
            // ... (Basic fallback)

            callback({ name, phone, detail, city });
            document.body.removeChild(overlay);
        };
    }

}

// Start app
const app = new App();
