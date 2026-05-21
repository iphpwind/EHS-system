<template>
  <div class="jusheng">
		<div class="toptit">
			<img src="@/assets/images/jusheng/toptitle.png"/>
			<div class="fangda">
			  <i v-if="size == 'small'" style="cursor: pointer;" @click="changeSize()"><img src="@/assets/images/fangda.png"></i>
			  <i v-if="size == 'big'" style="cursor: pointer;" @click="changeSize()"><img
			      src="@/assets/images/suoxiao.png"></i>
			</div>
		</div>
		<div class="main">
			<div class="floor1">
				<el-row :gutter="20">
					<el-col :span="12">
						<div class="guanzhuang">
							<div class="boxtit">
								<h2>灌装</h2>
								<div class="line"></div>
							</div>
							<div class="guanzhuangrow">
								<el-row>
									<el-col :span="8">
										<div class="left">
											<div class="item">
												<div class="number">{{gzData['416954669802029057']}}</div>
												<div class="tip">实际产量计数(瓶)</div>
											</div>
											<div class="item">
												<div class="number">{{gzData['416954669802029057']}}</div>
												<div class="tip">温度(°C)</div>
											</div>
											<div class="item">
												<div class="number">{{gzData['416954669839777793']}}</div>
												<div class="tip">设定速度(瓶/小时)</div>
											</div>
											<div class="item">
												<div class="number">{{gzData['416954669873332225']}}</div>
												<div class="tip">实时速度(瓶/小时)</div>
											</div>
										</div>
									</el-col>
									<el-col :span="16">
										<div class="right">
											<div class="item">
												<img v-if="gzData['416955308208652289']==1" src="@/assets/images/jusheng/gzdata-on.png"/>
												<img v-if="gzData['416955308208652289']==0" src="@/assets/images/jusheng/gzdata-off.png"/>
												<div class="tip">冲洗泵</div>
											</div>
											<div class="item">
                        <img v-if="gzData['416955308242206721']==1" src="@/assets/images/jusheng/gzdata-on.png"/>
                        <img v-if="gzData['416955308242206721']==0" src="@/assets/images/jusheng/gzdata-off.png"/>
												<div class="tip">理盖电机</div>
											</div>
											<div class="item">
                        <img v-if="gzData['416955308548390913']==1" src="@/assets/images/jusheng/gzdata-on.png"/>
                        <img v-if="gzData['416955308548390913']==0" src="@/assets/images/jusheng/gzdata-off.png"/>
												<div class="tip">回流阀</div>
											</div>
											<div class="item">
												<img v-if="gzData['416955308531613697']==1" src="@/assets/images/jusheng/gzdata-on.png"/>
                        <img v-if="gzData['416955308531613697']==0" src="@/assets/images/jusheng/gzdata-off.png"/>
												<div class="tip">进液阀</div>
											</div>
											<div class="item">
                        <img v-if="gzData['416955308313509889']==1" src="@/assets/images/jusheng/gzdata-on.png"/>
                        <img v-if="gzData['416955308313509889']==0" src="@/assets/images/jusheng/gzdata-off.png"/>
												<div class="tip">输送电机</div>
											</div>
											<div class="item">
                        <img v-if="gzData['416955308376424449']==1" src="@/assets/images/jusheng/gzdata-on.png"/>
                        <img v-if="gzData['416955308376424449']==0" src="@/assets/images/jusheng/gzdata-off.png"/>
												<div class="tip">上盖电机</div>
											</div>
											<div class="item">
                        <img v-if="gzData['416955308292538369']==1" src="@/assets/images/jusheng/gzdata-on.png"/>
                        <img v-if="gzData['416955308292538369']==0" src="@/assets/images/jusheng/gzdata-off.png"/>
												<div class="tip">旋转上瓶</div>
											</div>
											<div class="item">
                        <img v-if="gzData['416955308393201665']==1" src="@/assets/images/jusheng/gzdata-on.png"/>
                        <img v-if="gzData['416955308393201665']==0" src="@/assets/images/jusheng/gzdata-off.png"/>
												<div class="tip">2#进瓶电机</div>
											</div>
											<div class="item">
                        <img v-if="gzData['416955308414173185']==1" src="@/assets/images/jusheng/gzdata-on.png"/>
                        <img v-if="gzData['416955308414173185']==0" src="@/assets/images/jusheng/gzdata-off.png"/>
												<div class="tip">2#输送电机</div>
											</div>
											<div class="item">
                        <img v-if="gzData['416955308435144705']==1" src="@/assets/images/jusheng/gzdata-on.png"/>
                        <img v-if="gzData['416955308435144705']==0" src="@/assets/images/jusheng/gzdata-off.png"/>
												<div class="tip">回流泵</div>
											</div>
											<div class="item">
                        <img v-if="gzData['416955308472893441']==1" src="@/assets/images/jusheng/gzdata-on.png"/>
                        <img v-if="gzData['416955308472893441']==0" src="@/assets/images/jusheng/gzdata-off.png"/>
												<div class="tip">3#输送电机</div>
											</div>
											<div class="item">
                        <img v-if="gzData['416955308569362433']==1" src="@/assets/images/jusheng/gzdata-on.png"/>
                        <img v-if="gzData['416955308569362433']==0" src="@/assets/images/jusheng/gzdata-off.png"/>
												<div class="tip">吹气阀</div>
											</div>
											<div class="item">
                        <img v-if="gzData['416955308661637121']==1" src="@/assets/images/jusheng/gzdata-on.png"/>
                        <img v-if="gzData['416955308661637121']==0" src="@/assets/images/jusheng/gzdata-off.png"/>
												<div class="tip">高位罐进液</div>
											</div>
											<div class="item">
                        <img v-if="gzData['416955308456116225']==1" src="@/assets/images/jusheng/gzdata-on.png"/>
                        <img v-if="gzData['416955308456116225']==0" src="@/assets/images/jusheng/gzdata-off.png"/>
												<div class="tip">倒瓶链</div>
											</div>
											<div class="item">
                        <img v-if="gzData['416955308493864961']==1" src="@/assets/images/jusheng/gzdata-on.png"/>
                        <img v-if="gzData['416955308493864961']==0" src="@/assets/images/jusheng/gzdata-off.png"/>
												<div class="tip">润滑泵</div>
											</div>
											<div class="item">
                        <img v-if="gzData['416955308800049153']==1" src="@/assets/images/jusheng/gzdata-on.png"/>
                        <img v-if="gzData['416955308800049153']==0" src="@/assets/images/jusheng/gzdata-off.png"/>
												<div class="tip">加热</div>
											</div>
											<div class="item">
                        <img v-if="gzData['416955308158320641']==1" src="@/assets/images/jusheng/gzdata-on.png"/>
                        <img v-if="gzData['416955308158320641']==0" src="@/assets/images/jusheng/gzdata-off.png"/>
												<div class="tip">主电机</div>
											</div>
										</div>
									</el-col>
								</el-row>
							</div>
						</div>
					</el-col>
					<el-col :span="12">
						<div class="penlin">
							<div class="boxtit">
								<h2>喷淋</h2>
								<div class="line"></div>
							</div>
							<div class="penlinrow">
                <div class="item">
                  <img v-if="plData['416956719357067265'] == 1" src="@/assets/images/jusheng/penlin-on.png"/>
                  <img v-if="plData['416956719357067265'] == 0" src="@/assets/images/jusheng/penlin-off.png"/>

                  <div class="tip">运行</div>
                </div>
								<div class="item">
									<img v-if="plData['416956719382233089'] == 1" src="@/assets/images/jusheng/penlin-on.png"/>
                  <img v-if="plData['416956719382233089'] == 0" src="@/assets/images/jusheng/penlin-off.png"/>

									<div class="tip">供水泵</div>
								</div>
								<div class="item">
                  <img v-if="plData['416956719415787521'] == 1" src="@/assets/images/jusheng/penlin-on.png"/>
									<img v-if="plData['416956719415787521'] == 0" src="@/assets/images/jusheng/penlin-off.png"/>
									<div class="tip">1#<br />喷淋泵</div>
								</div>
								<div class="item">
									<img v-if="plData['416956719436759041'] == 1" src="@/assets/images/jusheng/penlin-on.png"/>
                  <img v-if="plData['416956719436759041'] == 0" src="@/assets/images/jusheng/penlin-off.png"/>

									<div class="tip">2#<br />喷淋泵</div>
								</div>
								<div class="item">
									<img v-if="plData['416956719461924865'] == 1" src="@/assets/images/jusheng/penlin-on.png"/>
                  <img v-if="plData['416956719461924865'] == 0" src="@/assets/images/jusheng/penlin-off.png"/>

									<div class="tip">3#<br />喷淋泵</div>
								</div>
								<div class="item">
									<img v-if="plData['416956719487090689'] == 1" src="@/assets/images/jusheng/penlin-on.png"/>
                  <img v-if="plData['416956719487090689'] == 0" src="@/assets/images/jusheng/penlin-off.png"/>

									<div class="tip">4#<br />喷淋泵</div>
								</div>
								<div class="item">
									<img v-if="plData['416956719512256513'] == 1" src="@/assets/images/jusheng/penlin-on.png"/>
                  <img v-if="plData['416956719512256513'] == 0" src="@/assets/images/jusheng/penlin-off.png"/>

									<div class="tip">5#<br />喷淋泵</div>
								</div>

								<div class="item">
									<img v-if="plData['416956719684222977'] == 1" src="@/assets/images/jusheng/penlin-on.png"/>
                  <img v-if="plData['416956719684222977'] == 0" src="@/assets/images/jusheng/penlin-off.png"/>

									<div class="tip">回收泵</div>
								</div>
								<div class="item">
									<img v-if="plData['416956719717777409'] == 1" src="@/assets/images/jusheng/penlin-on.png"/>
                  <img v-if="plData['416956719717777409'] == 0" src="@/assets/images/jusheng/penlin-off.png"/>

									<div class="tip">进瓶链</div>
								</div>
                <div class="item">
                  <img v-if="plData['416956719747137537'] == 1" src="@/assets/images/jusheng/penlin-on.png"/>
                  <img v-if="plData['416956719747137537'] == 0" src="@/assets/images/jusheng/penlin-off.png"/>

                  <div class="tip">1#<br />出瓶链</div>
                </div>
                <div class="item">
                  <img v-if="plData['416956719780691969'] == 1" src="@/assets/images/jusheng/penlin-on.png"/>
                  <img v-if="plData['416956719780691969'] == 0" src="@/assets/images/jusheng/penlin-off.png"/>

                  <div class="tip">2#<br />出瓶链</div>
                </div>
								<div class="item">
									<img v-if="plData['416956719805857793'] == 1" src="@/assets/images/jusheng/penlin-on.png"/>
                  <img v-if="plData['416956719805857793'] == 0" src="@/assets/images/jusheng/penlin-off.png"/>

									<div class="tip">1#<br />进水阀</div>
								</div>
								<div class="item">
									<img v-if="plData['416956719826829313'] == 1" src="@/assets/images/jusheng/penlin-on.png"/>
                  <img v-if="plData['416956719826829313'] == 0" src="@/assets/images/jusheng/penlin-off.png"/>

									<div class="tip">2#<br />进水阀</div>
								</div>
								<div class="item">
									<img v-if="plData['416956719851995137'] == 1" src="@/assets/images/jusheng/penlin-on.png"/>
                  <img v-if="plData['416956719851995137'] == 0" src="@/assets/images/jusheng/penlin-off.png"/>

									<div class="tip">3#<br />进水阀</div>
								</div>
								<div class="item">
									<img v-if="plData['416956719877160961'] == 1" src="@/assets/images/jusheng/penlin-on.png"/>
                  <img v-if="plData['416956719877160961'] == 0" src="@/assets/images/jusheng/penlin-off.png"/>

									<div class="tip">4#<br />进水阀</div>
								</div>
								<div class="item">
									<img v-if="plData['416956719902326785'] == 1" src="@/assets/images/jusheng/penlin-on.png"/>
                  <img v-if="plData['416956719902326785'] == 0" src="@/assets/images/jusheng/penlin-off.png"/>

									<div class="tip">5#<br />进水阀</div>
								</div>
								<div class="item">
									<img v-if="plData['416956719927492609'] == 1" src="@/assets/images/jusheng/penlin-on.png"/>
                  <img v-if="plData['416956719927492609'] == 0" src="@/assets/images/jusheng/penlin-off.png"/>

									<div class="tip">2#<br />出水阀</div>
								</div>
								<div class="item">
									<img v-if="plData['416956719956852737'] == 1" src="@/assets/images/jusheng/penlin-on.png"/>
                  <img v-if="plData['416956719956852737'] == 0" src="@/assets/images/jusheng/penlin-off.png"/>

									<div class="tip">3#<br />出水阀</div>
								</div>
								<div class="item">
									<img v-if="plData['416956719986212865'] == 1" src="@/assets/images/jusheng/penlin-on.png"/>
                  <img v-if="plData['416956719986212865'] == 0" src="@/assets/images/jusheng/penlin-off.png"/>

									<div class="tip">4#<br />出水阀</div>
								</div>
								<div class="item">
									<img v-if="plData['416956720011378689'] == 1" src="@/assets/images/jusheng/penlin-on.png"/>
                  <img v-if="plData['416956720011378689'] == 0" src="@/assets/images/jusheng/penlin-off.png"/>

									<div class="tip">5#<br />出水阀</div>
								</div>
								<div class="item">
									<img v-if="plData['416956720040738817'] == 1" src="@/assets/images/jusheng/penlin-on.png"/>
                  <img v-if="plData['416956720040738817'] == 0" src="@/assets/images/jusheng/penlin-off.png"/>

									<div class="tip">蜂鸣器</div>
								</div>
								<div class="item">
									<img v-if="plData['416956720061710337'] == 1" src="@/assets/images/jusheng/penlin-on.png"/>
                  <img v-if="plData['416956720061710337'] == 0" src="@/assets/images/jusheng/penlin-off.png"/>

									<div class="tip">红灯</div>
								</div>
								<div class="item">
									<img v-if="plData['416956720082681857'] == 1" src="@/assets/images/jusheng/penlin-on.png"/>
                  <img v-if="plData['416956720082681857'] == 0" src="@/assets/images/jusheng/penlin-off.png"/>

									<div class="tip">绿灯</div>
								</div>
                <div class="item">
                  <img v-if="plData['416956720112041985'] == 1" src="@/assets/images/jusheng/penlin-on.png"/>
                  <img v-if="plData['416956720112041985'] == 0" src="@/assets/images/jusheng/penlin-off.png"/>

                  <div class="tip">黄灯</div>
                </div>


							</div>
						</div>
					</el-col>
				</el-row>
			</div>
			<div class="floor2">
				<el-row :gutter="20">
					<el-col :span="8">
						<div class="boxtit">
							<h2>压丸</h2>
							<div class="line"></div>
						</div>
						<div class="smalltit">
							YWJ250-II全自动软胶囊压丸机
						</div>
						<div class="yawan">
							<el-row>
								<el-col :span="6">
									<div class="left">
										<div class="item">
											<img v-if="ywData['416957637427298305'] == 1" src="@/assets/images/jusheng/yawan-on.png"/>
                      <img v-if="ywData['416957637427298305'] == 0" src="@/assets/images/jusheng/yawan-off.png"/>

											<div class="tip">运行</div>
										</div>
										<div class="item">
                      <img v-if="ywData['416957636856872961'] == 1" src="@/assets/images/jusheng/yawan-on.png"/>
											<img v-if="ywData['416957636856872961'] == 0" src="@/assets/images/jusheng/yawan-off.png"/>
											<div class="tip">喷体加热</div>
										</div>
										<div class="item">
											<img v-if="ywData['416957636873650177'] == 1" src="@/assets/images/jusheng/yawan-on.png"/>
                      <img v-if="ywData['416957636873650177'] == 0" src="@/assets/images/jusheng/yawan-off.png"/>

											<div class="tip">明胶盒加热</div>
										</div>
										<div class="item">
											<img v-if="ywData['416957636898816001'] == 1" src="@/assets/images/jusheng/yawan-on.png"/>
                      <img v-if="ywData['416957636898816001'] == 0" src="@/assets/images/jusheng/yawan-off.png"/>

											<div class="tip">伴热带加热</div>
										</div>
										<div class="item">
											<img v-if="ywData['416957636915593217'] == 1" src="@/assets/images/jusheng/yawan-on.png"/>
                      <img v-if="ywData['416957636915593217'] == 0" src="@/assets/images/jusheng/yawan-off.png"/>

											<div class="tip">胶轮风</div>
										</div>
									</div>
								</el-col>
								<el-col :span="18">
									<div class="right">
										<div class="mid">
											<div>{{ywData['416957231917793281']}}</div>
											<div style="color: #fffb4b;">{{ywData['416957231800352769']}}</div>
										</div>
										<div class="leftbtn">
											<div class="btn">{{ywData['416957231934570497']}}℃</div>
											<div class="btn">{{ywData['416957231833907201']}}℃</div>
										</div>
										<div class="leftbtn rightbtn">
											<div class="btn">{{ywData['416957231959736321']}}℃</div>
											<div class="btn">{{ywData['416957231854878721']}}℃</div>
										</div>
										<div class="zhou1">{{ywData['416957232089759745']}}</div>
										<div class="zhou2">{{ywData['416957232110731265']}}</div>
										<div class="zhou3">{{ywData['416957232127508481']}}</div>
										<div class="zhou4">{{ywData['416957232148480001']}}</div>
										<div class="leftbtn chanliang">
											<div class="btn">1111</div>
											<div class="btn">2222</div>
										</div>
										<div class="leftkaiguan">开</div>
										<div class="rightkaiguan">开</div>
									</div>
								</el-col>
							</el-row>
						</div>
					</el-col>
					<el-col :span="16">
						<div class="boxtit">
							<h2>转笼</h2>
							<div class="line"></div>
						</div>
						<div class="zhuanlong">
							<el-row :gutter="20">
								<el-col :span="12">
									<div class="smalltit">
										1#除湿机画面
<!--										<i class="time">2023/6/27 09:51:18AM</i>-->
										<span class="green" v-if="zlData['416958950655492097'] == 1">启动</span>
										<span class="red" v-if="zlData['416958950655492097'] == 0">停止</span>
									</div>
									<div class="left">
										<el-row :gutter="20">
											<el-col :span="6">
												<div class="item">
													<div class="tip">再生温度</div>
													<div class="data">{{ zlData['416958265692094465'] }}<span>℃</span></div>
												</div>
												<div class="item">
													<div class="tip">回风温度</div>
													<div class="data">{{ zlData['416958266002472961'] }}<span>℃</span></div>
												</div>
												<div class="item">
													<div class="tip">回风湿度</div>
													<div class="data">{{ zlData['416958265729843201'] }}<span>%</span></div>
												</div>
											</el-col>
											<el-col :span="18">
												<div class="zhuanlongpic">
													<div class="wdbtn wendu1">
														再生温度<span>{{ zlData['416958265729843201'] }}℃</span>
													</div>
													<div class="wdbtn wendu2">
														表冷温度1<span>{{ zlData['416958265784369153'] }}℃</span>
													</div>
													<div class="wdbtn wendu3">
														表冷温度2<span>{{ zlData['416958265830506497'] }}℃</span>
													</div>
													<div class="wendurt">
														<div class="wditem">
															回风温度1<span>{{ zlData['416958265876643841'] }}℃</span>
														</div>
														<div class="wditem">
															回风湿度1<span>{{ zlData['416958266048610305'] }}%</span>
														</div>
														<div class="wditem">
															回风温度2<span>{{ zlData['416958265952141313'] }}℃</span>
														</div>
														<div class="wditem">
															回风湿度2<span>{{ zlData['416958266107330561'] }}%</span>
														</div>
													</div>
<!--													<div class="wendustatus">状态：除湿机停止</div>-->
												</div>
											</el-col>
										</el-row>
									</div>
								</el-col>
								<el-col :span="12">
									<div class="smalltit">
										2#除湿机画面
<!--										<i class="time">2023/6/27 09:51:18AM</i>-->
                    <span class="green" v-if="zlData['416958950676463617'] == 1">启动</span>
                    <span class="red" v-if="zlData['416958950676463617'] == 0">停止</span>
									</div>
									<div class="left">
										<el-row :gutter="20">
											<el-col :span="6">
												<div class="item">
													<div class="tip">再生温度</div>
													<div class="data">{{ zlData['416958265708871681'] }}<span>℃</span></div>
												</div>
												<div class="item">
													<div class="tip">回风温度</div>
													<div class="data">{{ zlData['416958265729843201'] }}<span>℃</span></div>
												</div>
												<div class="item">
													<div class="tip">回风湿度</div>
													<div class="data">{{ zlData['416958265729843201'] }}<span>%</span></div>
												</div>
											</el-col>
											<el-col :span="18">
												<div class="zhuanlongpic">
													<div class="wdbtn wendu1">
														再生温度<span>{{ zlData['416958265755009025'] }}℃</span>
													</div>
													<div class="wdbtn wendu2">
														表冷温度1<span>{{ zlData['416958265805340673'] }}℃</span>
													</div>
													<div class="wdbtn wendu3">
														表冷温度2<span>{{ zlData['416958265851478017'] }}℃</span>
													</div>
													<div class="wendurt">
														<div class="wditem">
															回风温度1<span>{{ zlData['416958265926975489'] }}℃</span>
														</div>
														<div class="wditem">
															回风湿度1<span>{{ zlData['416958266077970433'] }}%</span>
														</div>
														<div class="wditem">
															回风温度2<span>{{ zlData['416958265977307137'] }}℃</span>
														</div>
														<div class="wditem">
															回风湿度2<span>{{ zlData['416958266136690689'] }}%</span>
														</div>
													</div>
<!--													<div class="wendustatus">状态：除湿机停止</div>-->
												</div>
											</el-col>
										</el-row>
									</div>
								</el-col>
							</el-row>
						</div>
					</el-col>
				</el-row>
			</div>
			<div class="floor3">
				<div class="boxtit">
					<h2>化胶</h2>
					<div class="line"></div>
				</div>
				<div class="huajiao">
					<el-row :gutter="20">
						<el-col :span="8">
							<div class="smalltit">
								手动画面
<!--								<i class="time">2023/6/27 09:51:18AM</i>-->
								<div class="rtbtn">
									<div class="btn">热水器加热</div>
								</div>
							</div>
							<div class="huajiaoleft">
								<div class="reshuiqi">
									<div>{{ hjData['416959469067272193'] }}</div>
									<div style="color: #fffb4b;">{{ hjData['416959469021134849'] }}</div>
								</div>
								<div class="wendu">
									<div class="item">{{ hjData['416959469042106369'] }}℃</div>
									<div class="item">{{ hjData['416959469176324097'] }}kg</div>
								</div>
							</div>
						</el-col>
						<el-col :span="8">
							<div class="smalltit">
								自动画面
<!--								<i class="time">2023/6/27 09:51:18AM</i>-->
                <div class="rtbtn">
                  <div class="btn">化胶罐自动运行</div>
                  <div class="btn">运行状态清除</div>
                </div>
							</div>
							<div class="huajiaomid">
								<div class="huamianitem">
									<div class="left">
										<div class="tip">热水器加热SV</div>
										<div class="tip">热水器加热PV</div>
									</div>
									<div class="right">
										<div class="data">{{ hjData['416959469067272193'] }}<span>℃</span></div>
										<div class="data" style="color: #fff">{{ hjData['416959469021134849'] }}<span>℃</span></div>
									</div>
								</div>
								<div class="huamianitem">
									<div class="left">
										<div class="tip">循环泵启动SV</div>
										<div class="tip">循环泵启动PV</div>
									</div>
									<div class="right">
										<div class="data">{{ hjData['416959469084049409'] }}<span>℃</span></div>
										<div class="data" style="color: #fff">{{ hjData['416959469084049409'] }}<span>℃</span></div>
									</div>
								</div>
								<div class="huamianitem">
									<div class="left">
										<div class="tip">纯水设定值SV</div>
										<div class="tip">纯水显示值PV</div>
									</div>
									<div class="right">
										<div class="data">{{ hjData['416959469209878529'] }}<span>Kg</span></div>
										<div class="data" style="color: #fff">{{ hjData['416959469235044353'] }}<span>Kg</span></div>
									</div>
								</div>
								<div class="huamianitem">
									<div class="left">
										<div class="tip">
											<img src="@/assets/images/jusheng/huajiao-addico1.png"/>
											添加甘油
										</div>
									</div>
									<div class="right">
										<div class="data">{{ hjData['416959469331513345'] }}<span>Kg</span></div>
										<div class="data" style="color: #fff">{{ hjData['416959469365067777'] }}<span>Kg</span></div>
									</div>
								</div>
								<div class="huamianitem">
									<div class="left">
										<div class="tip">投胶粉温度SV</div>
										<div class="tip">投胶粉温度PV</div>
									</div>
									<div class="right">
										<div class="data">{{ hjData['416959469134381057'] }}<span>℃</span></div>
										<div class="data" style="color: #fff">{{ hjData['416959469134381057'] }}<span>℃</span></div>
									</div>
								</div>
								<div class="huamianitem">
									<div class="left">
										<div class="tip">
											<img src="@/assets/images/jusheng/huajiao-addico2.png"/>
											添加胶粉
										</div>
									</div>
									<div class="right">
										<div class="data">{{ hjData['416959469272793089'] }}<span>Kg</span></div>
										<div class="data" style="color: #fff">{{ hjData['416959469306347521'] }}<span>Kg</span></div>
									</div>
								</div>
<!--								<div class="huamianitem">-->
<!--									<div class="left">-->
<!--										<div class="tip">溶胶温度SV</div>-->
<!--										<div class="tip">溶胶温度PV</div>-->
<!--									</div>-->
<!--									<div class="right">-->
<!--										<div class="data">{{ hjData['416959469176324097'] }}<span>℃</span></div>-->
<!--										<div class="data" style="color: #fff">{{ hjData['416959469176324097'] }}<span>℃</span></div>-->
<!--									</div>-->
<!--								</div>-->
								<div class="huamianitem">
									<div class="left">
										<div class="tip">气泡检测SV</div>
										<div class="tip">气泡检测PV</div>
									</div>
									<div class="right">
										<div class="data">{{ hjData['416959469558005761'] }}<span>M</span></div>
										<div class="data" style="color: #fff">{{ hjData['416959469507674113'] }}<span>M</span></div>
									</div>
								</div>
								<!-- <div class="huamianitem" style="background: transparent;"></div> -->
<!--								<div class="huamianitem">-->
<!--									<div class="left">-->
<!--										<div class="tip">溶胶时间SV</div>-->
<!--										<div class="tip">溶胶时间PV</div>-->
<!--									</div>-->
<!--									<div class="right">-->
<!--										<div class="data">{{ hjData['416959469176324097'] }}<span>℃</span></div>-->
<!--										<div class="data" style="color: #fff">{{ hjData['416959469176324097'] }}<span>℃</span></div>-->
<!--									</div>-->
<!--								</div>-->
								<div class="huamianitem">
									<div class="left">
										<div class="tip">气泡未检测SV</div>
										<div class="tip">气泡未检测PV</div>
									</div>
									<div class="right">
										<div class="data">{{ hjData['416959469583171585'] }}<span>M</span></div>
										<div class="data" style="color: #fff">{{ hjData['416959469528645633'] }}<span>M</span></div>
									</div>
								</div>
								<div class="huamianitem last">
									<div class="left">
										<div class="tip">停搅拌抽真空时间SV</div>
										<div class="tip">停搅拌抽真空时间PV</div>
									</div>
									<div class="right">
										<div class="data">{{ hjData['416959469612531713'] }}<span>M</span></div>
										<div class="data" style="color: #fff">{{ hjData['416959469633503233'] }}<span>M</span></div>
									</div>
								</div>
								<div class="xuhao">
									<img src="@/assets/images/jusheng/huajiao-right.png"/>
									<img src="@/assets/images/jusheng/huajiao-num1.png"/>
									<img src="@/assets/images/jusheng/huajiao-num2.png"/>
									<img src="@/assets/images/jusheng/huajiao-num3.png"/>
									<img src="@/assets/images/jusheng/huajiao-num4.png"/>
									<img src="@/assets/images/jusheng/huajiao-num5.png"/>
									<img src="@/assets/images/jusheng/huajiao-num6.png"/>
									<img src="@/assets/images/jusheng/huajiao-num7.png"/>
									<img src="@/assets/images/jusheng/huajiao-end.png"/>
									<!-- <img src="@/assets/images/jusheng/huajiao-cross.png"/>
									<img src="@/assets/images/jusheng/huajiao-or.png"/> -->
								</div>
							</div>
						</el-col>
						<el-col :span="8">
							<div class="smalltit">
								清洗画面
<!--								<i class="time">2023/6/27 09:51:18AM</i>-->
								<div class="rtbtn">
									<div class="btn">清洗自动运行</div>
									<div class="btn">运行状态清除</div>
								</div>
							</div>
							<div class="huajiaoright">
								<div class="huamianitem">
									<div class="left">
										<div class="tip">热水器加热SV</div>
										<div class="tip">热水器加热PV</div>
									</div>
									<div class="right">
										<div class="data">{{ hjData['416959469067272193'] }}<span>℃</span></div>
										<div class="data" style="color: #fff">{{ hjData['416959469021134849'] }}<span>℃</span></div>
									</div>
								</div>
								<div class="huamianitem">
									<div class="left">
										<div class="tip">清洗用水SV</div>
										<div class="tip">清洗用水PV</div>
									</div>
									<div class="right">
										<div class="data">{{ hjData['416959469256015873'] }}<span>Kg</span></div>
										<div class="data" style="color: #fff">{{ hjData['416959469256015873'] }}<span>Kg</span></div>
									</div>
								</div>
								<div class="huamianitem">
									<div class="left">
										<div class="tip">清洗温度SV</div>
										<div class="tip">清洗温度PV</div>
									</div>
									<div class="right">
										<div class="data">{{ hjData['416959469113409537'] }}<span>℃</span></div>
										<div class="data" style="color: #fff">{{ hjData['416959469113409537'] }}<span>℃</span></div>
									</div>
								</div>
								<div class="huamianitem">
									<div class="left">
										<div class="tip">清洗时间SV</div>
										<div class="tip">清洗时间PV</div>
									</div>
									<div class="right">
										<div class="data">{{ hjData['416959469667057665'] }}<span>M</span></div>
										<div class="data" style="color: #fff">{{ hjData['416959469704806401'] }}<span>M</span></div>
									</div>
								</div>
								<div class="xuhao">
									<img src="@/assets/images/jusheng/huajiao-right.png"/>
									<img src="@/assets/images/jusheng/huajiao-num1.png"/>
									<img src="@/assets/images/jusheng/huajiao-num2.png"/>
									<img src="@/assets/images/jusheng/huajiao-end.png"/>
								</div>
								<div class="rtbottom">
									<div class="item">
										<h5>微量添加甘油时间</h5>
										<div class="number">{{ hjData['416959469448953857'] }}<span>s</span></div>
									</div>
									<div class="item">
										<h5>微量添加胶粉时间</h5>
										<div class="number">{{ hjData['416959469427982337'] }}<span>s</span></div>
									</div>
									<div class="item">
										<h5>纯水提前量</h5>
										<div class="number">{{ hjData['416959469193101313'] }}<span>kg</span></div>
									</div>
									<div class="item">
										<h5>微量添加甘油重量</h5>
										<div class="number">{{ hjData['416959469407010817'] }}<span>kg</span></div>
									</div>
									<div class="item">
										<h5>微量添加胶粉重量</h5>
										<div class="number">{{ hjData['416959469390233601'] }}<span>kg</span></div>
									</div>
								</div>
							</div>
						</el-col>
					</el-row>
				</div>
			</div>
		</div>
  </div>
</template>

<script>
import {getIndustrySensorData} from "@/api/industry/industrySensorData";

export default {
  data() {
    return {
      gzData:{},
      plData:{},
      ywData:{},
      hjData:{},
      zlData:{},
			size: 'small',
			isFullscreen: false,
    }
  },

  watch: {

  },
  created() {
    this.timer = setInterval(()=>this.getData(),10000);
  },

  beforeUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  },

  mounted: function () {
    this.getData();
  },

  methods: {
		async toggleScreen() {
		  // 切换全屏r
		  // 如果当前未开启 点击就开启  如果已开启 点击关闭全屏
		  if (this.isFullScreen) {
		    // 关闭
		    document.exitFullscreen()
		  } else {
		    // 打开
		    document.documentElement.requestFullscreen()
		  }
		  this.isFullScreen = !this.isFullScreen
		},
		async changeSize() {
		  this.toggleScreen()
		  if (this.size == 'small') {
		    this.size = 'big'
		    document.querySelector('.sidebar-container').style = "width:0!important";
		    document.querySelector('.main-container').style = "margin-left:0!important";
		    document.querySelector('.app-main').style.minHeight = '100vh';
		    document.querySelector('.jusheng').style.minHeight = '100vh';
		    document.querySelector('.navbar').style.display = 'none';
		    document.querySelector('.tags-view-container').style.display = 'none';
		    document.querySelector('.hit').style.height = 'calc(100vh - 60px)';
		
		
		  } else if (this.size == 'big') {
		    this.size = 'small'
		    document.querySelector('.sidebar-container').style.width = "";
		    document.querySelector('.main-container').style.marginLeft = "";
		    document.querySelector('.navbar').style.display = 'block';
		    document.querySelector('.app-main').style.minHeight = 'calc(100vh - 84px)';
		    document.querySelector('.jusheng').style.minHeight = 'calc(100vh - 84px)';
		    document.querySelector('.tags-view-container').style.display = 'block'
		    document.querySelector('.hit').style.height = '100%';
		  }
		},
    async getData(){
      await this.getGzData();
      await this.getPlData();
      await this.getYwData();
      await this.getHjData();
      await this.getZlData();
    },
    async getGzData(){
       getIndustrySensorData(655).then(response => {
        const ycList = response.data.equipmentYcList;
        const yxList = response.data.equipmentYxList;
         if(ycList.length > 0){
           this.getGzcValue(ycList);
         }
         if(yxList.length > 0){
           this.getGzxValue(yxList);
         }
      });
    },
    async getGzcValue(list) {
      list.forEach(item=>{
        this.gzData[item.ycNo] = item.ycValue;
      })
    },
    async getGzxValue(list) {
      list.forEach(item=>{
        this.gzData[item.yxNo] = item.yxCurr;
      })
    },
    async getPlData(){
      getIndustrySensorData(656).then(response => {
        const ycList = response.data.equipmentYcList;
        const yxList = response.data.equipmentYxList;
        if(ycList.length > 0){
          this.getPlcValue(ycList);
        }
        if(yxList.length > 0){
          this.getPlxValue(yxList);
        }
      });
    },
    async getPlcValue(list) {
      list.forEach(item=>{
        this.plData[item.ycNo] = item.ycValue;
      })
    },
    async getPlxValue(list) {
      list.forEach(item=>{
        this.plData[item.yxNo] = item.yxCurr;
      })
    },
    async getYwData(){
      getIndustrySensorData(657).then(response => {
        const ycList = response.data.equipmentYcList;
        const yxList = response.data.equipmentYxList;
        if(ycList.length > 0){
          this.getYwcValue(ycList);
        }
        if(yxList.length > 0){
          this.getYwxValue(yxList);
        }
      });
    },
    async getYwcValue(list) {
      list.forEach(item=>{
        this.ywData[item.ycNo] = item.ycValue;
      })
    },
    async getYwxValue(list) {
      list.forEach(item=>{
        this.ywData[item.yxNo] = item.yxCurr;
      })
    },
    async getZlData(){
      getIndustrySensorData(658).then(response => {
        const ycList = response.data.equipmentYcList;
        const yxList = response.data.equipmentYxList;
        if(ycList.length > 0){
          this.getZlcValue(ycList);
        }
        if(yxList.length > 0){
          this.getZlxValue(yxList);
        }
      });
    },
    async getZlcValue(list) {
      list.forEach(item=>{
        this.zlData[item.ycNo] = item.ycValue;
      })
    },
    async getZlxValue(list) {
      list.forEach(item=>{
        this.zlData[item.yxNo] = item.yxCurr;
      })
    },
    async getHjData(){
      getIndustrySensorData(659).then(response => {
        const ycList = response.data.equipmentYcList;
        const yxList = response.data.equipmentYxList;
        if(ycList.length > 0){
          this.getHjcValue(ycList);
        }
        if(yxList.length > 0){
          this.getHjxValue(yxList);
        }
      });
    },
    async getHjcValue(list) {
      list.forEach(item=>{
        this.hjData[item.ycNo] = item.ycValue;
      })
    },
    async getHjxValue(list) {
      list.forEach(item=>{
        this.hjData[item.yxNo] = item.yxCurr;
      })
    },
  },

}
</script>


<style scoped lang="scss">
.jusheng {
  height: calc(100vh - 84px);
	background: url("@/assets/images/jusheng/jushengbg.jpg") no-repeat;
	background-size: cover;
	.toptit{
		img{
			height: 70px;display: block;margin: 0 auto;
		}
		.fangda {
		  position: absolute;
		  right: 20px;
		  top: 20px;
		  font-size: 18px;
		  color: #2aa7d3;
			img{
				width: 30px;height: 30px;
			}
		}
	}
	.main{
		height: calc(100% - 90px);padding: 0 30px;
		:deep(.el-row) {
			height: 100%;
			.el-col{
				height: 100%;
			}
		}
		.boxtit{
			position: relative;
			h2{
				position: relative;
				margin: 0;font-size: 20px;color: #fff;font-weight: bold;
				padding: 0 0 10px 20px;
			}
			h2:before{
				content: '';width: 6px;height: 20px;background: #29a5e2;
				border-radius: 5px;
				position: absolute;left: 0;top: 0;
			}
			h2:after{
				content: '';width: 2px;height: 20px;background: #91cdfe;
				position: absolute;right: 0;top: 0;
			}
			.line{
				position: relative;width: calc(100% - 24px);height: 2px;background: #91cdfe;
				margin: 0 auto;
			}
		}
		.boxtit:before{
			content: '';width: 8px;height: 2px;background: #fff;
			position: absolute;left: 0;bottom: 0;
		}
		.boxtit:after{
			content: '';width: 8px;height: 2px;background: #fff;
			position: absolute;right: 0;bottom: 0;
		}
		.floor1{
			height: 30%;
			.guanzhuang{
				height: 100%;
				.guanzhuangrow{
					height: calc(100% - 40px);margin: 6px 0 0;
					.left{
						height: 100%;padding: 10px 6px 5px;
						background: url("@/assets/images/jusheng/gzdata-boxbg.png") no-repeat;
						background-size: 100% 100%;
						.item{
							height: calc(50% - 6px);
							width: 48%;float: left;margin: 0 1% 6px;
							background: url("@/assets/images/jusheng/gzdata-bg.png") no-repeat;
							background-size: 100% 100%;
							padding: 0 5px;
							text-align: center;
							.number{
								font-size: 24px;color: #fff;
								padding: 12px 0 0;
							}
							.tip{
								font-size: 12px;color: #fff;
								background: url("@/assets/images/jusheng/gzdata-btn.png") repeat-x;
								background-size: 100% 100%;
								border-radius: 30px;
								padding: 5px 0;
								white-space: nowrap;
							}
						}
					}
					.right{
						height: 100%;
						.item{
							height: 33.33%;width: 14.28%;float: left;
							img{
								display: block;margin: 0 auto;
								height: calc(100% - 19px);
							}
							.tip{
								font-size: 14px;color: #fff;text-align: center;
								white-space: nowrap;
							}
						}
						.item:nth-child(8){
							margin-left: 7.14%;
						}
					}
				}
			}
			.penlin{
				height: 100%;
				.penlinrow{
					height: calc(100% - 40px);margin: 10px 0 0;
					.item{
						height: calc(33.3% - 8px);
						width: 12%;float: left;margin: 0 0.25% 10px;
						position: relative;
						img{
							height: 100%;width: 100%;
						}
						.tip{
							width: 56%;height: 100%;
							position: absolute;right: 5px;top: 0;
							display: flex;
							align-items: center;justify-content: center;
							color: #fff;font-size: 14px;
							white-space: nowrap;
						}
					}
				}
			}
		}
		.smalltit{
			padding-left: 36px;
			background: url("@/assets/images/jusheng/boxtit-bg.png") no-repeat left;
			background-size: auto 100%;
			height: 30px;line-height: 30px;
			color: #fff;font-size: 16px;
			margin: 10px 0 0;
			position: relative;
			i{
				font-style: normal;margin-left: 10px;
				font-size: 14px;color: #b5b5b6;
			}
			span{
				position: absolute;
				right: 0;
				top: 5px;
				font-size: 12px;color: #fff;
				border-radius: 20px;
				line-height: 25px;
				display: block;width: 80px;text-align: center;
			}
			.green{
				background: url("@/assets/images/jusheng/zhuanlong-on.png") no-repeat;
				background-size: 100% 100%;
			}
			.red{
				background: url("@/assets/images/jusheng/zhuanlong-off.png") no-repeat;
				background-size: 100% 100%;
			}
		}
		.floor2{
			height: calc(35% - 5px);margin: 10px 0;
			.yawan{
				height: calc(100% - 76px);
				
				.left{
					height: calc(100% - 5px);margin-top: 10px;
					.item{
						height: calc(20% - 6px);margin: 6px 0;
						img{
							height: 100%;float: left;display: block;
							max-width: 50%;
						}
						.tip{
							width: 50%;float: left;height: 100%;
							font-size: 14px;color: #fff;line-height: 1;
							display: flex;
							align-items: center;
							padding-left: 10px;
						}
					}
				}
				.right{
					height: calc(100% - 10px);margin: 10px 0 0;
					background: url("@/assets/images/jusheng/yawan-bg.png") no-repeat left;
					background-size: 100% 100%;
					position: relative;font-size: 12px;
					color: #fff;
					.mid{
						width: 10%;text-align: center;
						line-height: 1.4;
						position: absolute;
						top: 27%;
						left: 43.5%;
						height: 20%;
						div{
							height: 50%;
							display: flex;
							justify-content: center;
							flex-flow: column;
						}
					}
					.leftbtn{
						width: 18%;
						position: absolute;
						left: 13%;
						top: 32%;
						.btn{
							background: url("@/assets/images/jusheng/temp-bluebg.png") no-repeat left;
							background-size: 100% 100%;
							text-align: center;
							margin: 0 0 3px;
						}
						.btn:last-child{
							background: url("@/assets/images/jusheng/temp-greenbg.png") no-repeat left;
							background-size: 100% 100%;
						}
					}
					.rightbtn{
						left: 65%;
						top: 32%;
					}
					.zhou1{
						width: 10%;text-align: center;color: #fffb4b;
						position: absolute;
						top: 47%;
						left: 32.5%;
						height: 11%;
						display: flex;
						justify-content: center;
						flex-flow: column;
					}
					.zhou2{
						width: 10%;text-align: center;
						position: absolute;
						top: 47%;
						left: 53.5%;
						height: 11%;
						display: flex;
						justify-content: center;
						flex-flow: column;
					}
					.zhou3{
						width: 10%;text-align: center;color: #fffb4b;
						position: absolute;
						top: 62%;
						left: 18%;
						height: 11%;
						display: flex;
						justify-content: center;
						flex-flow: column;
					}
					.zhou4{
						width: 10%;text-align: center;color: #fffb4b;
						position: absolute;
						top: 62%;
						left: 67.5%;
						height: 11%;
						display: flex;
						justify-content: center;
						flex-flow: column;
					}
					.chanliang{
						width: 11%;
						left: 53%;
						bottom: 4%;
						top: auto;
						height: 13%;
						.btn{
							background: transparent !important;
							color: #fffb4b;margin: 0;
							height: 50%;
							display: flex;
							justify-content: center;
							flex-flow: column;
							color: red;
						}
					}
					.leftkaiguan{
						font-size: 12px;color: #333;
						position: absolute;
						left: 4%;
						bottom: 16%;
						width: 8%;
						text-align: center;
					}
					.rightkaiguan{
						font-size: 12px;color: #333;
						position: absolute;
						right: 9%;
						bottom: 16%;
						width: 8%;
						text-align: center;
					}
				}
			}
			.zhuanlong{
				height: calc(100% - 30px);
				.left{
					height: calc(100% - 50px);
					margin-top: 10px;
					.item{
						height: calc(33.33% - 4px);margin: 0 0 6px;color: #fff;
						text-align: center;
						display: flex;align-items: center;justify-content: center;
						.tip{
							font-size: 12px;
							width: 46%;float: left;
						}
						.data{
							font-size: 18px;font-weight: bold;
							width: 54%;float: left;
							span{
								font-size: 12px;
							}
						}
					}
					.item:nth-child(1){
						background: url("@/assets/images/jusheng/zhuanlong-wendubg1.png") no-repeat;
						background-size: 100% 100%;
						.data{
							color: #fffb4b;
						}
					}
					.item:nth-child(2){
						background: url("@/assets/images/jusheng/zhuanlong-wendubg2.png") no-repeat;
						background-size: 100% 100%;
					}
					.item:nth-child(3){
						background: url("@/assets/images/jusheng/zhuanlong-wendubg3.png") no-repeat;
						background-size: 100% 100%;
					}
					.zhuanlongpic{
						height: 100%;
						background: url("@/assets/images/jusheng/zhuanlong-bg.png") no-repeat;
						background-size: 100% 100%;
						position: relative;
						.wdbtn{
							width: 28%;text-align: center;
							color: #fff;
							font-size: 12px;
							position: absolute;
							background: url("@/assets/images/jusheng/temp-bluebg.png") no-repeat;
							background-size: 100% 100%;
							span{
								margin-left: 10px;
							}
						}
						.wendu1{
							background: url("@/assets/images/jusheng/temp-greenbg.png") no-repeat;
							background-size: 100% 100%;
							top: 15.5%;
							left: 31%;
						}
						.wendu2{
							bottom: 30%;
							left: 9%;
						}
						.wendu3{
							bottom: 1%;
							left: 9%;
						}
						.wendurt{
							height: 40%;width: 28%;
							position: absolute;
							right: 20px;top: 16%;
							.wditem{
								height: 25%;margin-bottom: 2px;
								background: url("@/assets/images/jusheng/zhuanlong-databg.png") no-repeat;
								background-size: 100% 100%;
								font-size: 12px;color: #fff;
								text-align: center;
								white-space: nowrap;
								span{
									margin-left: 10px;
								}
							}
						}
						.wendustatus{
							font-size: 12px;color: #fff;
							position: absolute;
							top: 62%;right: 20px;
						}
					}
				}
			}
		}
		.floor3{
			height: calc(35% - 5px);
			.huajiao{
				height: calc(100% - 30px);
				.smalltit{
					.rtbtn{
						position: absolute;right: 0;top:0;
						.btn{
							font-size: 12px;color: #fff;padding: 8px 20px;
							background: url("@/assets/images/jusheng/huajiao-btn.png") no-repeat;
							background-size: 100% 100%;
							line-height: 1;
							margin-left: 10px;
							display: inline-block;
						}
					}
				}
				.huajiaoleft{
					height: calc(100% - 46px);margin-top: 6px;
					background: url("@/assets/images/jusheng/huajiao-bg.png") no-repeat;
					background-size: 100% 100%;
					position: relative;
					.reshuiqi{
						width: 7.2%;text-align: center;
						font-size: 12px;color: #fff;line-height: 1.2;
						position: absolute;
						left: 5%;
						top: 60%;
						height: 15%;
						div{
							height: 50%;
							display: flex;
							justify-content: center;
							flex-flow: column;
						}
					}
					.wendu{
						position: absolute;width: 14%;
						left: 46%;
						bottom: 4%;
						.item{
							color: #fff;text-align: center;
							font-size: 12px;
							background: url("@/assets/images/jusheng/temp-greenbg.png") no-repeat;
							background-size: 100% 100%;
						}
						.item:last-child{
							margin-top: 2px;
							background: url("@/assets/images/jusheng/temp-bluebg.png") no-repeat;
							background-size: 100% 100%;
						}
					}
				}
				.huamianitem{
					height: calc(25% - 4px);
					width: 29.3%;margin: 4px 2% 0;
					float: left;
					background: url("@/assets/images/jusheng/huajiao-databg1.png") no-repeat;
					background-size: 100% 100%;
					padding: 0 8px;
					.left{
						width: 55%;float: left;height: 100%;
						display: flex;align-items: center;justify-content: center;
						flex-direction:column;
						.tip{
							font-size: 12px;color: #91cdfe;
							white-space: nowrap;
							img{
								height: 80%;margin-right: 5px;
								vertical-align: middle;
							}
						}
					}
					.right{
						width: 45%;float: left;height: 100%;
						text-align: right;
						display: flex;justify-content: center;
						flex-direction:column;
						.data{
							font-size: 16px;font-weight: bold;
							color: #fffb4b;
							span{
								font-size: 12px;
							}
						}
					}
				}
				.xuhao{
					img{
						position: absolute;
					}
					img:nth-child(1){
						left: 31%;
						top: 10%;
					}
					img:nth-child(2){
						left: 63.4%;
						top: 10%;
					}
					img:nth-child(3){
						left: 96%;
						top: 10%;
					}
					img:nth-child(4){
						left: 31%;
						top: 34%;
					}
					img:nth-child(5){
						left: 63.4%;
						top: 34%;
					}
					img:nth-child(6){
						left: 96%;
						top: 34%;
					}
					img:nth-child(7){
						left: 31%;
						top: 60%;
					}
					img:nth-child(8){
						left: 63.4%;
						top: 60%;
					}
					img:nth-child(9){
						left: 96%;
						top: 60%;
					}
				}
				.huajiaomid{
					height: calc(100% - 46px);margin-top: 6px;
					background: url("@/assets/images/jusheng/huajiao-bg2.png") no-repeat;
					background-size: 100% 100%;
					position: relative;
					padding-right: 15px;
					.last{
						background: url("@/assets/images/jusheng/huajiao-databg2.png") no-repeat;
						background-size: 100% 100%;
						height: 40%;
						position: relative;
						.left{
							.tip{
								white-space: normal;
							}
						}
					}
					
				}
				.huajiaoright{
					height: calc(100% - 46px);margin-top: 6px;
					background: url("@/assets/images/jusheng/huajiao-bg2.png") no-repeat;
					background-size: 100% 100%;
					position: relative;
					padding-right: 15px;
					.rtbottom{
						height: 50%;clear: both;
						padding-top: 15px;
						.item{
							width: 20%;height: 100%;float: left;
							text-align: center;
							h5{
								font-size: 12px;color: #fff;
								margin: 0 0 6px;
								white-space: nowrap
							}
							.number{
								font-size: 30px;font-weight: bold;
								span{
									font-size: 12px;
								}
							}
						}
						.item:nth-child(1){
							background: url("@/assets/images/jusheng/huajiao-rtico1.png") no-repeat center ;
							.number{
								color: #80e6ff;
							}
						}
						.item:nth-child(2){
							background: url("@/assets/images/jusheng/huajiao-rtico2.png") no-repeat center ;
							.number{
								color: #669dff;
							}
						}
						.item:nth-child(3){
							background: url("@/assets/images/jusheng/huajiao-rtico3.png") no-repeat center ;
							.number{
								color: #ffba69;
							}
						}
						.item:nth-child(4){
							background: url("@/assets/images/jusheng/huajiao-rtico4.png") no-repeat center ;
							.number{
								color: #669dff;
							}
						}
						.item:nth-child(5){
							background: url("@/assets/images/jusheng/huajiao-rtico5.png") no-repeat center ;
							.number{
								color: #80e6ff;
							}
						}
					}
				}
			}
		}
	}
}

</style>




