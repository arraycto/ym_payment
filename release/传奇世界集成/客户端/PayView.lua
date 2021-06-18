downBg:registerScriptHandler(function(event)
    if event == "enter" then
        cclog("进入支付........................................")
        M:register(refresh)

        -- 请求充值返回订单号
        g_msgHandlerInst:registerMsgHandler(FRAME_SC_CHARGE_REQ, function(buf)

            cclog("角色信息：" .. CURRENT_ROLE.Name)

            local t = g_msgHandlerInst:convertBufferToTable("FrameChargeRetProtocol", buf)

            -- t.charNo
            for key, value in pairs(t) do
                --cclog(key .. "：" .. tostring(value))
            end

            --payNetLoading(true)

            -- 充值金额   1000表示1:1000比例
            local totalAmount = curPayItem/1000;

            -- 拼接成订单名称（区服+角色ID+充值金额）
            local orderName = tostring(t.worldID) .. "_" .. tostring(userInfo.currRoleStaticId) .. "_"  .. totalAmount

            print("开始支付：", orderName)

            -- 拼接充值链接参数
            local payParam = "userId=" .. tostring(userInfo.currRoleStaticId) .. "&userName=" .. CURRENT_ROLE.Name
                    .. "&appId=" .. tostring(t.worldID) .. "&totalAmount=".. totalAmount

            --打开网页进入充值页面
            if isAndroid() then
                cc.Application:getInstance():openURL("http://pay.ymbok.com:8090/pay?" .. payParam)
            elseif isIOS() then
                cc.Application:getInstance():openURL("http://pay.ymbok.com:8090/pay?appId=" .. tostring(t.worldID))
            else
                cc.Application:getInstance():openURL("http://pay.ymbok.com:8090/pay?" .. payParam)
            end

            payNetLoading(false)

            MessageBox("充值后元宝将发放到邮件中,小退游戏就能收到哦!!!","确定",function()
            end)
        end)

    elseif event == "exit" then
        cclog("退出支付............................................")
        M:unregister(refresh)
        g_msgHandlerInst:registerMsgHandler(FRAME_SC_CHARGE_REQ, nil)
    end
end)