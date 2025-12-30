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
            pricingOption: '滿幫优车',
            cargoName: '配件零件',
            packaging: '吨包',
            weight: '',
            volume: '',
            dimensions: { l: '', w: '', h: '' },
            loadAddr: { city: '深圳市 龙华区', name: '利金城科技工业园', detail: '吉华路58号' },
            unloadAddr: { city: '深圳市 龙岗区', name: '金荣达荣寓', detail: '坂田街道' },
            pickupTime: '明天 晚上18:00-21:00',
            deliveryTime: '请填写',
            serviceType: '标准达'
        };

        this.init();
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
            this.navigate('home');
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
        const hideNavViews = ['login', 'register', 'addressPicker', 'mapPicker', 'timePicker', 'cargoInfo', 'cargoNameSelection', 'vehicleSelection', 'vehicleDetails'];
        if (hideNavViews.includes(viewId)) {
            this.nav.classList.add('hidden');
        } else {
            this.nav.classList.remove('hidden');
        }

        this.renderView(viewId, params);
    }

    renderView(viewId, params) {
        this.main.innerHTML = '';
        switch (viewId) {
            case 'login': this.renderLogin(); break;
            case 'register': this.renderRegister(); break;
            case 'home': this.renderHome(); break;
            case 'ship': this.renderShip(); break;
            case 'waybills': this.renderWaybills(); break;
            case 'statements': this.renderStatements(); break;
            case 'profile': this.renderProfile(); break;
            case 'messages': this.renderMessages(); break;
            case 'addressPicker': this.renderAddressPicker(params.type); break;
            case 'mapPicker': this.renderMapPicker(params.type); break;
            case 'timePicker': this.renderTimePicker(params.type); break;
            default: this.renderHome();
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
                            <button class="btn btn-primary" style="width: 120px; font-size: 12px;">获取验证码</button>
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
            this.navigate('home');
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

    renderHome() {
        const stats = MockData.stats;
        this.main.innerHTML = `
            <div class="container">
                <header class="mb-4" style="display: flex; justify-content: space-between; align-items: center;">
                    <h2 style="margin: 0; font-size: 20px;">首页</h2>
                    <span class="material-icons" id="home-msg-btn" style="color: var(--text-secondary); cursor: pointer;">notifications</span>
                </header>

                <div class="card" style="background: linear-gradient(135deg, var(--primary-color), #60A5FA); color: white;">
                    <div style="font-size: 13px; opacity: 0.9; margin-bottom: 8px;">今日待办</div>
                    <div style="display: flex; justify-content: space-between; text-align: center;">
                        <div>
                            <div style="font-size: 24px; font-weight: bold;">${stats.cargoCount}</div>
                            <div style="font-size: 12px; opacity: 0.8;">待发货</div>
                        </div>
                        <div>
                            <div style="font-size: 24px; font-weight: bold;">${stats.orderCount}</div>
                            <div style="font-size: 12px; opacity: 0.8;">在途运单</div>
                        </div>
                        <div>
                            <div style="font-size: 24px; font-weight: bold;">${stats.paymentDue}</div>
                            <div style="font-size: 12px; opacity: 0.8;">待付运费</div>
                        </div>
                    </div>
                </div>

                <h3 style="font-size: 16px; margin-bottom: 12px;">常用功能</h3>
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px;">
                    ${this.renderQuickAction('local_shipping', '发布货源', 'ship')}
                    ${this.renderQuickAction('assignment', '我的运单', 'waybills')}
                    ${this.renderQuickAction('receipt', '回单管理', '#')}
                    ${this.renderQuickAction('calculate', '运费计算', '#')}
                </div>

                <h3 style="font-size: 16px; margin-bottom: 12px;">最新运单</h3>
                <div>
                   ${MockData.waybills.map(wb => this.renderWaybillCard(wb)).join('')}
                </div>
            </div>
        `;

        // Bind quick actions
        document.querySelectorAll('.quick-action').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.currentTarget.dataset.target;
                if (target !== '#') this.navigate(target);
            });
        });

        // Bind message button
        const msgBtn = document.getElementById('home-msg-btn');
        if (msgBtn) {
            msgBtn.addEventListener('click', () => {
                this.navigate('messages');
            });
        }
    }

    renderMessages() {
        this.main.innerHTML = `
            <div class="container">
                <header class="mb-4" style="display: flex; align-items: center; gap: 12px;">
                    <span class="material-icons" id="back-to-home" style="cursor: pointer; color: var(--text-secondary);">arrow_back</span>
                    <h2 style="font-size: 20px; margin: 0;">我的消息</h2>
                </header>
                
                <div style="margin-bottom: 20px;">
                    ${MockData.messages.map(msg => `
                        <div class="card" style="padding: 16px; position: relative;">
                            ${!msg.isRead ? '<div style="position: absolute; top: 16px; right: 16px; width: 8px; height: 8px; background: red; border-radius: 50%;"></div>' : ''}
                            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                                <span class="material-icons" style="font-size: 18px; color: ${this.getMessageColor(msg.type)};">info</span>
                                <span style="font-weight: bold; font-size: 14px;">${msg.type}</span>
                                <span style="font-size: 12px; color: var(--text-secondary); margin-left: auto;">${msg.time}</span>
                            </div>
                            <div style="font-size: 15px; font-weight: 500; margin-bottom: 4px;">${msg.title}</div>
                            <div style="font-size: 13px; color: var(--text-secondary); line-height: 1.6;">${msg.content}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        const backBtn = document.getElementById('back-to-home');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.navigate('home');
            });
        }
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
            <div class="bg-light" style="min-height: 100%; padding-bottom: 100px;">
                <div style="background: white; padding: 12px 16px; border-bottom: 1px solid var(--border-color); display: flex; align-items: center; gap: 12px;">
                    <span class="material-icons" id="ship-back-btn" style="cursor: pointer; color: var(--text-secondary);">arrow_back</span>
                    <h2 style="font-size: 18px; margin: 0; flex: 1; text-align: center;">发布货源</h2>
                </div>

                <div style="background: #F0F9FF; padding: 10px 16px; display: flex; align-items: center; justify-content: space-between;">
                    <div style="display: flex; align-items: center; gap: 6px;">
                         <span class="material-icons" style="color: var(--primary-color); font-size: 16px;">verified_user</span>
                         <span style="font-size: 12px; font-weight: 500;">平台保障 · 2万货运险 · 轨迹可监控</span>
                    </div>
                </div>

                <div class="container">
                    <div class="addr-card">
                        <div class="addr-row" id="load-addr-trigger" style="cursor: pointer;">
                            <div class="addr-icon load">装</div>
                            <div class="addr-info">
                                <div class="addr-title">${form.loadAddr.city}</div>
                                <div class="addr-sub">${form.loadAddr.name} ${form.loadAddr.detail}</div>
                            </div>
                            <span class="material-icons" style="color: #ccc;">chevron_right</span>
                        </div>
                        <div style="height: 1px; background: #eee; margin-left: 36px;"></div>
                        <div class="addr-row" id="unload-addr-trigger" style="cursor: pointer;">
                            <div class="addr-icon unload">卸</div>
                            <div class="addr-info">
                                <div class="addr-title">${form.unloadAddr.city}</div>
                                <div class="addr-sub">${form.unloadAddr.name} ${form.unloadAddr.detail}</div>
                            </div>
                            <span class="material-icons" style="color: #ccc;">chevron_right</span>
                        </div>
                    </div>

                    <div class="card">
                        <div id="cargo-info-trigger" class="flex justify-between items-center" style="padding: 12px 0; border-bottom: 1px solid #f9f9f9; cursor: pointer;">
                            <span style="color: var(--text-secondary);">货物信息</span>
                            <span style="font-weight: 500;">${form.cargoName}, ${form.packaging}, ${form.weight || '0'}吨, ${form.volume || '0'}方 ></span>
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
                        <div class="price-option ${form.pricingOption === '滿幫优车' ? 'selected' : ''}" data-val="滿幫优车">
                            <span class="material-icons" style="margin-right: 12px; color: ${form.pricingOption === '滿幫优车' ? 'var(--primary-color)' : '#ccc'};">${form.pricingOption === '滿幫优车' ? 'check_circle' : 'radio_button_unchecked'}</span>
                            <div style="flex: 1;">
                                <div style="font-weight: bold;">满帮优车 <span class="badge" style="background: var(--primary-color); color: white;">优</span></div>
                                <div style="font-size: 11px; color: var(--text-secondary);">附近车，接单快</div>
                            </div>
                            <div style="text-align: right;">
                                <div style="font-weight: bold; color: var(--primary-color);">¥170/车起</div>
                                <div style="font-size: 10px; color: var(--text-secondary);">已优惠30元</div>
                            </div>
                        </div>
                        <div class="price-option ${form.pricingOption === '整车发货' ? 'selected' : ''}" data-val="整车发货">
                             <span class="material-icons" style="margin-right: 12px; color: ${form.pricingOption === '整车发货' ? 'var(--primary-color)' : '#ccc'};">${form.pricingOption === '整车发货' ? 'check_circle' : 'radio_button_unchecked'}</span>
                            <div style="flex: 1;">
                                <div style="font-weight: bold;">整车发货</div>
                                <div style="font-size: 11px; color: var(--text-secondary);">司机多，价格优</div>
                            </div>
                            <div style="text-align: right;">
                                <div style="font-weight: bold;">¥180元/车</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="pricing-bar">
                    <button class="btn btn-primary btn-half" style="background: var(--primary-color); height: 48px;">支付并找车</button>
                    <button class="btn btn-half" style="background: #FAAD14; color: white; height: 48px;">到付</button>
                </div>
            </div>
        `;

        // --- Bind Events ---
        document.getElementById('ship-back-btn').onclick = () => this.navigate('home');
        document.getElementById('vehicle-select-trigger').onclick = () => this.renderVehicleSelection();
        document.getElementById('cargo-info-trigger').onclick = () => this.renderCargoInfo();

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
    }

    renderCargoInfo() {
        const form = this.shipForm;
        this.main.innerHTML = `
            <div class="bg-light" style="min-height: 100%; padding-bottom: 80px;">
                <header style="background: white; padding: 12px 16px; border-bottom: 1px solid var(--border-color); display: flex; align-items: center; gap: 12px;">
                    <span class="material-icons" id="back-to-ship-from-cargo" style="cursor: pointer; color: var(--text-secondary);">arrow_back</span>
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

                    <div class="card">
                        <div class="flex justify-between items-center" style="margin-bottom: 20px;">
                            <div style="font-weight: bold; font-size: 14px;">总重量/体积 <span style="font-weight: normal; font-size: 12px; color: var(--text-secondary);">(选填一项)</span></div>
                            <div class="flex items-center" style="gap: 6px;">
                                <span style="font-size: 13px; color: var(--text-secondary);">按公斤</span>
                                <label class="switch">
                                    <input type="checkbox">
                                    <span class="slider"></span>
                                </label>
                            </div>
                        </div>

                        <div class="flex items-center justify-between mb-4">
                            <span style="color: var(--text-secondary); font-size: 14px;">重量</span>
                            <div class="flex items-center gap-2">
                                <div class="stepper">
                                    <div class="stepper-btn" id="weight-minus">-</div>
                                    <input type="number" class="stepper-input" id="weight-input" value="${form.weight}" placeholder="0-20">
                                    <div class="stepper-btn" id="weight-plus">+</div>
                                </div>
                                <span style="color: var(--text-secondary); font-size: 14px;">吨</span>
                            </div>
                        </div>

                        <div class="flex items-center justify-between">
                            <span style="color: var(--text-secondary); font-size: 14px;">体积</span>
                            <div class="flex items-center gap-2">
                                <div class="stepper">
                                    <div class="stepper-btn" id="volume-minus">-</div>
                                    <input type="number" class="stepper-input" id="volume-input" value="${form.volume}" placeholder="0-70">
                                    <div class="stepper-btn" id="volume-plus">+</div>
                                </div>
                                <span style="color: var(--text-secondary); font-size: 14px;">方</span>
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

        document.getElementById('back-to-ship-from-cargo').onclick = () => this.renderShip();
        document.getElementById('cargo-name-trigger').onclick = () => this.renderCargoNameSelection();

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

        document.getElementById('confirm-cargo-btn').onclick = () => this.renderShip();
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
            <div class="bg-light" style="min-height: 100%; padding-bottom: 80px;">
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

        document.getElementById('back-to-ship').onclick = () => this.renderShip();
        document.getElementById('car-detail-trigger').onclick = () => this.renderVehicleDetails();

        document.querySelectorAll('#length-grid .grid-item').forEach(item => {
            item.onclick = () => {
                this.shipForm.vehicleLength = item.dataset.val;
                this.renderVehicleSelection();
            };
        });

        document.querySelectorAll('#type-grid .grid-item').forEach(item => {
            item.onclick = () => {
                this.shipForm.vehicleType = item.dataset.val;
                this.renderVehicleSelection();
            };
        });

        document.getElementById('confirm-vehicle-btn').onclick = () => this.renderShip();
    }

    renderVehicleDetails() {
        this.main.innerHTML = `
            <div class="bg-light" style="min-height: 100%; padding-bottom: 40px;">
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
            <div style="text-align: center; display: flex; flex-direction: column; align-items: center; gap: 8px;">
                <img src="${icon}" style="width: 56px; height: 56px; object-fit: contain;">
                <div class="vehicle-label-divider">${name}</div>
            </div>
        `;
    }

    renderWaybills() {
        this.main.innerHTML = `
            <div class="container">
                <header class="mb-4"><h2 style="font-size: 20px; margin: 0;">我的运单</h2></header>
                <div style="display: flex; overflow-x: auto; gap: 10px; margin-bottom: 16px; padding-bottom: 4px;">
                    <span style="padding: 6px 12px; background: var(--primary-color); color: white; border-radius: 16px; font-size: 12px; white-space: nowrap;">全部</span>
                    <span style="padding: 6px 12px; background: white; color: var(--text-secondary); border-radius: 16px; font-size: 12px; white-space: nowrap;">待装货</span>
                    <span style="padding: 6px 12px; background: white; color: var(--text-secondary); border-radius: 16px; font-size: 12px; white-space: nowrap;">运输中</span>
                    <span style="padding: 6px 12px; background: white; color: var(--text-secondary); border-radius: 16px; font-size: 12px; white-space: nowrap;">已签收</span>
                </div>
                <div>
                   ${MockData.waybills.map(wb => this.renderWaybillCard(wb)).join('')}
                </div>
            </div>
        `;
    }

    renderStatements() {
        this.main.innerHTML = `
            <div class="container">
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
                `).join('')}
                
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
        this.main.innerHTML = `
            <div class="bg-light" style="min-height: 100%; padding-bottom: 80px;">
                <div style="background: linear-gradient(180deg, var(--primary-color), #3B82F6); padding: 40px 20px 60px; color: white; border-bottom-left-radius: 24px; border-bottom-right-radius: 24px;">
                    <div style="display: flex; align-items: center; gap: 16px;">
                        <div style="width: 64px; height: 64px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; overflow: hidden; border: 3px solid rgba(255,255,255,0.3);">
                            <span class="material-icons" style="font-size: 40px; color: var(--primary-color);">person</span>
                        </div>
                        <div style="flex: 1;">
                            <div style="font-size: 20px; font-weight: bold; margin-bottom: 4px;">${user.name}</div>
                            <div style="font-size: 13px; opacity: 0.9; display: flex; align-items: center; gap: 4px;">
                                <span class="material-icons" style="font-size: 14px;">verified_user</span>
                                实名认证已通过
                            </div>
                        </div>
                        <span class="material-icons" style="opacity: 0.8;">settings</span>
                    </div>
                </div>

                <div class="container" style="margin-top: -30px;">
                    <div class="card" style="display: grid; grid-template-columns: repeat(3, 1fr); padding: 20px 0; text-align: center;">
                        <div>
                            <div style="font-size: 18px; font-weight: bold; margin-bottom: 4px;">12</div>
                            <div style="font-size: 11px; color: var(--text-secondary);">我的评价</div>
                        </div>
                        <div style="border-left: 1px solid #f0f0f0; border-right: 1px solid #f0f0f0;">
                            <div style="font-size: 18px; font-weight: bold; margin-bottom: 4px;">5</div>
                            <div style="font-size: 11px; color: var(--text-secondary);">关注司机</div>
                        </div>
                        <div>
                            <div style="font-size: 18px; font-weight: bold; margin-bottom: 4px;">320</div>
                            <div style="font-size: 11px; color: var(--text-secondary);">勋章豆</div>
                        </div>
                    </div>

                    <div class="card" style="padding: 0;">
                        ${this.renderProfileItem('history', '发货记录', '查看全部')}
                        ${this.renderProfileItem('favorite', '常发路线')}
                        ${this.renderProfileItem('account_balance_wallet', '我的钱包', '¥8,230.00')}
                        ${this.renderProfileItem('card_membership', '满帮会员', '做任务领勋章豆', '', true)}
                    </div>

                    <div class="card" style="padding: 0; margin-top: 16px;">
                        ${this.renderProfileItem('notifications', '消息通知', '3条未读', 'messages')}
                        ${this.renderProfileItem('headset_mic', '在线客服')}
                        ${this.renderProfileItem('help_outline', '发货指南')}
                        ${this.renderProfileItem('share', '推荐给好友')}
                    </div>

                    <button class="btn" style="background: white; color: #DC2626; border: none; margin-top: 24px; font-weight: bold; height: 48px; border-radius: 12px;" id="logout-btn">退出当前账号</button>
                    <div style="text-align: center; font-size: 11px; color: #ccc; margin-top: 20px;">当前版本 v2.4.0</div>
                </div>
            </div>
        `;

        document.querySelectorAll('.profile-item').forEach(item => {
            item.onclick = () => {
                const target = item.dataset.target;
                if (target) this.navigate(target);
            };
        });

        document.getElementById('logout-btn').onclick = () => {
            MockData.user.isLoggedIn = false;
            this.navigate('login');
        };
    }

    // --- Address & Time Pickers ---

    renderAddressPicker(type) {
        const title = type === 'load' ? '装货地址' : '卸货地址';
        const addr = type === 'load' ? this.shipForm.loadAddr : this.shipForm.unloadAddr;
        const activeColor = 'var(--primary-color)';

        this.main.innerHTML = `
            <div class="bg-light" style="min-height: 100%;">
                <header style="background: white; padding: 12px 16px; border-bottom: 1px solid var(--border-color); display: flex; align-items: center; gap: 12px;">
                    <span class="material-icons" id="back-to-ship" style="cursor: pointer; color: var(--text-secondary);">arrow_back</span>
                    <h2 style="font-size: 18px; margin: 0; flex: 1; text-align: center;">${title}</h2>
                    <div id="map-trigger" style="display: flex; flex-direction: column; align-items: center; cursor: pointer;">
                        <span class="material-icons" style="font-size: 20px; color: ${activeColor};">location_on</span>
                        <span style="font-size: 10px; color: ${activeColor};">地图选点</span>
                    </div>
                </header>

                <div class="container">
                    <div class="addr-input-card">
                        <div class="flex items-center justify-between" style="border-bottom: 1px solid #f9f9f9; padding-bottom: 8px;">
                            <span style="font-size: 15px; color: #333;">${addr.city}</span>
                            <span class="material-icons" style="font-size: 18px; color: #ccc;">chevron_right</span>
                        </div>
                        <div class="addr-main-input">
                            <input type="text" id="addr-name-input" value="${addr.name}" style="border: none; font-size: 20px; font-weight: bold; width: 100%; outline: none;" placeholder="地点名称">
                            <input type="text" id="addr-detail-input" value="${addr.detail}" style="border: none; font-size: 14px; color: var(--text-secondary); width: 100%; outline: none;" placeholder="详细地址">
                            <div class="flex justify-end mt-4" style="gap: 16px;">
                                <span class="material-icons" style="color: #999;">mic</span>
                                <span class="material-icons" style="color: #999; cursor: pointer;" id="clear-addr">cancel</span>
                            </div>
                        </div>
                        <div class="flex justify-around mt-4" style="padding-top: 12px; border-top: 1px solid #f9f9f9;">
                            <div class="flex items-center gap-1 address-extra-btn" style="font-size: 13px; color: #666; cursor: pointer;"><span class="material-icons" style="font-size: 16px;">book</span>地址簿</div>
                            <div class="flex items-center gap-1 address-extra-btn" style="font-size: 13px; color: #666; cursor: pointer;"><span class="material-icons" style="font-size: 16px;">person_add</span>添加联系人</div>
                            <div class="flex items-center gap-1 address-extra-btn" style="font-size: 13px; color: #666; cursor: pointer;"><span class="material-icons" style="font-size: 16px;">qr_code_scanner</span>地址智能识别</div>
                        </div>
                    </div>

                    <div style="color: #999; font-size: 15px; margin: 20px 0 10px;">历史地址</div>
                    <div class="card" style="padding: 0 16px;">
                        ${[
                { name: '利金城科技工业园', detail: '广东省-深圳市-龙华区 吉华路58号', city: '深圳市 龙华区' },
                { name: '万科城', detail: '广东省-深圳市-龙岗区 坂田街道', city: '深圳市 龙岗区' },
                { name: '深圳北站', detail: '广东省-深圳市-龙华区 民治街道', city: '深圳市 龙华区' }
            ].map((item, i) => `
                            <div class="addr-history-item" data-name="${item.name}" data-detail="${item.detail}" data-city="${item.city}">
                                <span class="material-icons" style="color: #999; font-size: 20px; margin-top: 2px;">history</span>
                                <div style="flex: 1;">
                                    <div style="font-weight: bold; font-size: 16px;">${item.name} ${i === 0 ? '<span class="addr-tag-now" style="background: var(--primary-color);">当前定位</span>' : ''}</div>
                                    <div style="font-size: 13px; color: var(--text-secondary); margin-top: 4px;">${item.detail}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="footer-btn-fixed">
                    <button class="btn btn-primary" id="confirm-addr-btn" style="background: var(--primary-color); border-radius: 12px; height: 50px;">确定</button>
                </div>
            </div>
        `;

        document.getElementById('back-to-ship').onclick = () => this.navigate('ship');
        document.getElementById('map-trigger').onclick = () => this.navigate('mapPicker', { type });

        document.getElementById('clear-addr').onclick = () => {
            document.getElementById('addr-name-input').value = '';
            document.getElementById('addr-detail-input').value = '';
        };

        document.querySelectorAll('.address-extra-btn').forEach(btn => {
            btn.onclick = () => alert('此功能正在开发中...');
        });

        document.querySelectorAll('.addr-history-item').forEach(item => {
            item.onclick = () => {
                const name = item.dataset.name;
                const detail = item.dataset.detail;
                const city = item.dataset.city;
                document.getElementById('addr-name-input').value = name;
                document.getElementById('addr-detail-input').value = detail;
                // Update shipForm immediately but only finalize on confirm
            };
        });

        document.getElementById('confirm-addr-btn').onclick = () => {
            const name = document.getElementById('addr-name-input').value;
            const detail = document.getElementById('addr-detail-input').value;
            const city = addr.city; // keep city for now or extract from detail
            if (type === 'load') {
                this.shipForm.loadAddr = { city, name, detail };
            } else {
                this.shipForm.unloadAddr = { city, name, detail };
            }
            this.navigate('ship');
        };
    }

    renderMapPicker(type) {
        const title = type === 'load' ? '装货点' : '卸货点';
        const activeColor = 'var(--primary-color)';

        this.main.innerHTML = `
            <div style="height: 100%; display: flex; flex-direction: column;">
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
                item.querySelector('.flex').insertAdjacentHTML('beforeend', `<span class="material-icons" style="color: ${activeColor}; font-size: 20px;">check</span>`);

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
        const activeColor = 'var(--primary-color)';

        // Initial selected state
        let selDay = '今天';
        let selRange = '下午';
        let selStart = '随时';
        let selEnd = '18:00';

        const updateDisplay = () => {
            const displayEl = document.getElementById('time-display-text');
            if (displayEl) {
                displayEl.innerHTML = `${selDay} ${selRange}${selStart === '随时' ? '' : selStart + '-'}${selEnd}前 ${isPickup ? '装货' : '卸货'}`;
            }
        };

        this.main.innerHTML = `
            <div style="height: 100%; display: flex; flex-direction: column; background: rgba(0,0,0,0.5);">
                <div style="flex: 1;" id="close-time-picker"></div>
                <div class="time-picker-modal">
                    <header style="padding: 16px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f9f9f9;">
                        <span style="font-size: 18px; font-weight: bold;">${title}</span>
                        <span class="material-icons" id="x-close-time" style="color: #999; cursor: pointer;">close</span>
                    </header>

                    <div class="time-picker-body">
                        <div class="time-day-tabs">
                            <div class="day-tab active" data-val="今天">今天 ⛅</div>
                            <div class="day-tab" data-val="明天">明天 ☁️</div>
                            <div class="day-tab" data-val="后天">后天 ☀️</div>
                            <div class="day-tab" style="color: #999; font-size: 13px;">更多 <span class="material-icons" style="font-size: 14px;">expand_more</span></div>
                        </div>
                        <div class="time-content">
                            <div class="time-range-tabs">
                                <div class="range-tab active" data-val="下午">下午</div>
                                <div class="range-tab" data-val="晚上">晚上</div>
                            </div>
                            <div class="time-picker-columns">
                                <div class="time-col" id="start-time-col">
                                    <div class="time-col-header">- 最早装货 -</div>
                                    <div class="time-slot active" data-val="随时">随时</div>
                                    ${[17, 18, 19, 20, 21, 22].map(h => `<div class="time-slot" data-val="${h}:00">${h}:00</div>`).join('')}
                                </div>
                                <div class="time-col" style="border-left: 1px solid #f9f9f9;" id="end-time-col">
                                    <div class="time-col-header">- 最晚装货 -</div>
                                    <div class="time-slot active" data-val="18:00" style="color: ${activeColor};">18:00</div>
                                    ${[19, 20, 21, 22, 23, 24].map(h => `<div class="time-slot" data-val="${h}:00">${h}:00</div>`).join('')}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style="padding: 20px 16px; background: white; text-align: center;">
                        <div style="font-weight: bold; font-size: 18px; margin-bottom: 16px;" id="time-display-text">今天 下午18:00前 ${isPickup ? '装货' : '卸货'}</div>
                        <button class="btn btn-primary" id="confirm-time-btn" style="background: ${activeColor}; border-radius: 12px; height: 50px;">确定</button>
                    </div>
                </div>
            </div>
        `;

        const close = () => this.navigate('ship');
        document.getElementById('close-time-picker').onclick = close;
        document.getElementById('x-close-time').onclick = close;

        document.querySelectorAll('.day-tab[data-val]').forEach(tab => {
            tab.onclick = () => {
                document.querySelectorAll('.day-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                selDay = tab.dataset.val;
                updateDisplay();
            };
        });

        document.querySelectorAll('.range-tab').forEach(tab => {
            tab.onclick = () => {
                document.querySelectorAll('.range-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                selRange = tab.dataset.val;
                updateDisplay();
            };
        });

        document.querySelectorAll('#start-time-col .time-slot').forEach(slot => {
            slot.onclick = () => {
                document.querySelectorAll('#start-time-col .time-slot').forEach(s => s.classList.remove('active'));
                slot.classList.add('active');
                selStart = slot.dataset.val;
                updateDisplay();
            };
        });

        document.querySelectorAll('#end-time-col .time-slot').forEach(slot => {
            slot.onclick = () => {
                document.querySelectorAll('#end-time-col .time-slot').forEach(s => {
                    s.classList.remove('active');
                    s.style.color = '#333';
                });
                slot.classList.add('active');
                slot.style.color = activeColor;
                selEnd = slot.dataset.val;
                updateDisplay();
            };
        });

        document.getElementById('confirm-time-btn').onclick = () => {
            const finalTime = `${selDay} ${selRange}${selStart === '随时' ? '' : selStart + '-'}${selEnd}前`;
            if (isPickup) this.shipForm.pickupTime = finalTime;
            else this.shipForm.deliveryTime = finalTime;
            this.navigate('ship');
        };
    }

    // --- Components ---

    renderQuickAction(icon, label, target) {
        return `
            <div class="quick-action" data-target="${target}" style="display: flex; flex-direction: column; align-items: center; background: white; padding: 12px; border-radius: 8px;">
                <span class="material-icons" style="color: var(--primary-color); margin-bottom: 4px;">${icon}</span>
                <span style="font-size: 12px;">${label}</span>
            </div>
        `;
    }

    renderWaybillCard(wb) {
        return `
            <div class="card">
                <div style="display: flex; justify-content: space-between; font-size: 12px; color: var(--text-secondary); margin-bottom: 8px; border-bottom: 1px solid #f3f3f3; padding-bottom: 8px;">
                    <span>运单号：${wb.id}</span>
                    <span style="color: var(--primary-color);">${wb.status}</span>
                </div>
                <div style="display: flex; align-items: center; margin-bottom: 12px;">
                    <div style="font-weight: bold; font-size: 16px;">${wb.origin.split('·')[0]}</div>
                    <div style="margin: 0 12px; color: var(--text-secondary); display: flex; flex-direction: column; align-items: center;">
                        <span style="font-size: 10px;">---></span>
                    </div>
                    <div style="font-weight: bold; font-size: 16px;">${wb.destination.split('·')[0]}</div>
                    <div style="margin-left: auto; font-size: 14px; font-weight: 500;">${wb.cargo} ${wb.weight}</div>
                </div>
                <div style="font-size: 12px; color: var(--text-secondary); display: flex; justify-content: space-between;">
                    <span>${wb.driver} ${wb.plate}</span>
                    <span>${wb.date}</span>
                </div>
            </div>
        `;
    }

    renderProfileItem(icon, label, value = '', viewId = '') {
        return `
            <div class="profile-item" data-target="${viewId}" style="display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid #f3f3f3; cursor: pointer;">
                <span class="material-icons" style="color: var(--text-secondary); margin-right: 12px; font-size: 20px;">${icon}</span>
                <span style="flex: 1; font-size: 14px;">${label}</span>
                <span style="font-size: 12px; color: var(--text-secondary); margin-right: 4px;">${value}</span>
                <span class="material-icons" style="font-size: 16px; color: #ccc;">chevron_right</span>
            </div>
        `;
    }
}

// Start app
const app = new App();
