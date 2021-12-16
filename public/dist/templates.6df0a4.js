angular.module('mrtApp.templates', []).run(['$templateCache', function ($templateCache) {
  "use strict";
  $templateCache.put("views/about.html",
    "<mrt-breadcrumbs location=\"'Codepit'\" title=\"'Sobre o Codepit'\">\n" +
    "</mrt-breadcrumbs>\n" +
    "\n" +
    "<mrt-blog-posts page-path=\"'about'\" is-info=true></mrt-blog-posts>\n" +
    "");
  $templateCache.put("views/contests/contest/contest-join-sidenav.html",
    "<div ng-controller=ContestJoinController id=join-contest-id>\n" +
    "  <md-sidenav class=\"md-sidenav-right md-whiteframe-z2\" md-component-id=join-contest-sidenav>\n" +
    "    <form name=form ng-submit=join()>\n" +
    "      <md-toolbar class=md-hue-2>\n" +
    "        <div style=\"padding: 15px\">\n" +
    "          Participar de <b>{{ContestState.contest.name}}</b>\n" +
    "        </div>\n" +
    "      </md-toolbar>\n" +
    "      <md-content layout-padding>\n" +
    "        <md-input-container ng-show=ContestState.contest.isPrivate>\n" +
    "          <label>Senha</label>\n" +
    "          <input type=password ng-model=password ng-required=ContestState.contest.isPrivate>\n" +
    "        </md-input-container>\n" +
    "        <md-radio-group ng-model=role ng-show=\"ContestState.contest.contestantType === 3\" ng-required=\"ContestState.contest.contestantType === 3\">\n" +
    "          <md-radio-button value=individual>Participar <b>individualmente</b></md-radio-button>\n" +
    "          <md-radio-button value=team>Participar <b>em time</b></md-radio-button>\n" +
    "        </md-radio-group>\n" +
    "        <div ng-show=isTeam() layout-fill>\n" +
    "          <p>\n" +
    "            <i>Escolha um time</i>&nbsp;\n" +
    "            <i class=\"fa fa-question-circle\" style=\"width: 50px\">\n" +
    "              <md-tooltip md-direction=bottom>\n" +
    "                Se registrar na competição com um time X não irá automaticamente<br>\n" +
    "                adicionar os outros membros do time X na competição. Para isso,<br>\n" +
    "                cada membro do time também deve se cadastrar na competição.<br>\n" +
    "              </md-tooltip>\n" +
    "            </i>\n" +
    "          </p>\n" +
    "          <br>\n" +
    "          <small ng-show=\"teams.length === 0\">Você não está em nenhum time.</small>\n" +
    "          <md-input-container ng-show=\"teams.length > 0\" layout-fill>\n" +
    "            <label>Time</label>\n" +
    "            <md-select ng-model=team ng-required=isTeam()>\n" +
    "              <md-option ng-repeat=\"t in teams\" ng-value=t._id>\n" +
    "                {{t.name}}\n" +
    "              </md-option>\n" +
    "            </md-select>\n" +
    "          </md-input-container>\n" +
    "        </div>\n" +
    "        <div layout=row>\n" +
    "          <md-button class=md-icon-button ng-click=close() style=\"margin-top: 5px\">\n" +
    "            <md-icon class=material-icons style=color:grey>keyboard_return</md-icon>\n" +
    "          </md-button>\n" +
    "          <md-button class=\"md-fab md-mini md-primary\" ng-click=join() ng-disabled=form.$invalid ng-hide=loading>\n" +
    "            <md-icon class=material-icons style=color:white>person_add</md-icon>\n" +
    "          </md-button>\n" +
    "          <md-progress-circular md-mode=indeterminate md-diameter=60 ng-show=loading></md-progress-circular>\n" +
    "        </div>\n" +
    "      </md-content>\n" +
    "    </form>\n" +
    "  </md-sidenav>\n" +
    "</div>\n" +
    "");
  $templateCache.put("views/contests/contest/contest.html",
    "<mrt-breadcrumbs location=\"'Codepit / Competições / ' + state.current.title\" title=ContestState.contest.name>\n" +
    "</mrt-breadcrumbs>\n" +
    "\n" +
    "<mrt-page-wrapper wait-while=\"ContestState.loading !== false\" class=contest-view>\n" +
    "  <mrt-contest-progress start-time=ContestState.contest.date_start end-time=ContestState.contest.date_end frozen-time=ContestState.contest.frozen_time blind-time=ContestState.contest.blind_time has-frozen=ContestState.contest.hasFrozen has-blind=ContestState.contest.hasBlind>\n" +
    "  </mrt-contest-progress>\n" +
    "  <div class=row style=\"margin-top: 20px\">\n" +
    "    <div class=\"col-sm-12 bs-component\">\n" +
    "      <ul class=\"contest-tabs nav nav-tabs\" style=\"margin-bottom: 15px\">\n" +
    "        <li class=join-button ng-if=\"ContestState.contest.inContest === false && UserState.isAuthenticated()\">\n" +
    "          <a href=\"\" ng-click=toggleRight()>Participar&nbsp;<i class=\"fa fa-user-plus\" aria-hidden=true></i></a>\n" +
    "        </li>\n" +
    "        <li ng-class=\"{active: state.current.name === 'contest.scoreboard'}\">\n" +
    "          <a ui-sref=.scoreboard>Placar&nbsp;<i class=\"fa fa-trophy\" aria-hidden=true></i></a>\n" +
    "        </li>\n" +
    "        <li ng-class=\"{active: state.current.name === 'contest.submit'}\" ng-if=\"ContestState.contest.inContest && ContestState.contest.hasStarted\">\n" +
    "          <a ui-sref=.submit>Submeter&nbsp;<i class=\"fa fa-send\" aria-hidden=true></i></a>\n" +
    "        </li>\n" +
    "        <li ng-class=\"{active: state.current.name === 'contest.submissions'}\" ng-if=\"ContestState.contest.inContest && ContestState.contest.hasStarted\">\n" +
    "          <a ui-sref=.submissions>Submissões&nbsp;<i class=\"fa fa-bars\" aria-hidden=true></i></a>\n" +
    "        </li>\n" +
    "        <li class=manage ng-class=\"{active: state.current.name === 'contest.edit'}\" ng-if=\"ContestState.contest.isContestAdmin && !ContestState.contest.hasEnded\">\n" +
    "          <a ui-sref=.edit>Editar&nbsp;<i class=\"fa fa-wrench\" aria-hidden=true></i></a>\n" +
    "        </li>\n" +
    "        <li class=leave-button ng-if=\"ContestState.contest.inContest && ContestState.loadedSubmissions && ContestState.submissionsIds.length === 0\">\n" +
    "          <md-tooltip md-direction=right>\n" +
    "            Você pode se desregistrar da competição<br>\n" +
    "            enquanto não tiver feito nenhuma ação nela.<br>\n" +
    "          </md-tooltip>\n" +
    "          <a href=\"\" mrt-confirm-click=leave()>Sair&nbsp;<i class=\"fa fa-user-times\" aria-hidden=true></i></a>\n" +
    "        </li>\n" +
    "      </ul>\n" +
    "      <div class=tab-content>\n" +
    "        <div ng-show=\"state.current.name === 'contest.scoreboard'\">\n" +
    "          <ng-include src=\"'views/contests/contest/contest.scoreboard.html'\"></ng-include>\n" +
    "        </div>\n" +
    "        <div ng-show=\"state.current.name === 'contest.submit'\">\n" +
    "          <ng-include src=\"'views/contests/contest/contest.submit.html'\"></ng-include>\n" +
    "        </div>\n" +
    "        <div ng-show=\"state.current.name === 'contest.submissions'\">\n" +
    "          <ng-include src=\"'views/contests/contest/contest.submissions.html'\"></ng-include>\n" +
    "        </div>\n" +
    "        <div ng-show=\"state.current.name === 'contest.edit'\">\n" +
    "          <ng-include src=\"'views/contests/settings/contest.settings.html'\"></ng-include>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</mrt-page-wrapper>\n" +
    "\n" +
    "<ng-include src=\"'views/contests/contest/contest-join-sidenav.html'\"></ng-include>\n" +
    "");
  $templateCache.put("views/contests/contest/contest.scoreboard.html",
    "<div ng-controller=ContestScoreboardController class=table-responsive>\n" +
    "	<div ng-if=ContestState.canViewContest>\n" +
    "		<table class=\"table scoreboard\">\n" +
    "			<thead>\n" +
    "			  <tr>\n" +
    "			    <th>Rank</th>\n" +
    "			    <th style=\"width: 100px\">Nome</th>\n" +
    "			    <th ng-repeat=\"problem in ContestState.problems\">\n" +
    "			      <div class=\"balloon balloon-contest\">\n" +
    "			        <img ng-src=/imgs/baloes/{{$index}}.png class=balloon-image>\n" +
    "			        <a ui-sref=\"problems.view({id:problem._id, index:$index})\" target=_blank class=balloon-label>{{$index | mrtAlphabetize}}</a>\n" +
    "			      </div>\n" +
    "			    </th>\n" +
    "			    <th>Questões</th>\n" +
    "					<th>Tempo</th>\n" +
    "			  </tr>\n" +
    "			</thead>\n" +
    "			<tbody>\n" +
    "				<tr ng-repeat=\"c in ContestState.contestantsIds track by c\" id={{c}} ng-class=\"{'user-row': isRep(c)}\">\n" +
    "					<td class=rank-cell>{{$index+1}}</td>\n" +
    "					<td>\n" +
    "						<div ng-if=ContestState.contestants[c].handles>\n" +
    "							<a ui-sref=team({id:ContestState.contestants[c].id}) class=team-label>\n" +
    "								{{ContestState.contestants[c].name}}\n" +
    "							</a>\n" +
    "							<div class=row-handles>\n" +
    "								(<span ng-repeat=\"user in ContestState.contestants[c].handles\"><span ng-if=\"$index!==0\">,&nbsp;</span><a class=user-label ui-sref=profile({id:user[0]})>{{user[1]}}</a></span>)\n" +
    "							</div>\n" +
    "						</div>\n" +
    "						<div ng-if=!ContestState.contestants[c].handles>\n" +
    "							<a ui-sref=profile({id:ContestState.contestants[c].id}) class=\"user user-label\">\n" +
    "								{{ContestState.contestants[c].name}}\n" +
    "							</a>\n" +
    "						</div>\n" +
    "					</td>\n" +
    "					<td ng-repeat=\"problem in ContestState.problems track by (c + problem._id)\" class=cell ng-class=getCellClass(c,problem._id) ng-click=spySubmissions(c,problem._id)>\n" +
    "			      <div style=font-size:11px>{{getCellAttempts(c,problem._id)}}</div>\n" +
    "			      <div class=time-cell>{{getCellPenalty(c,problem._id)}}</div>\n" +
    "			    </td>\n" +
    "					<td class=rank-cell>{{getRowResults(c, 'solved')}}</td>\n" +
    "			    <td class=rank-cell>{{getRowResults(c, 'penalty')}}</td>\n" +
    "				</tr>\n" +
    "			</tbody>\n" +
    "		</table>\n" +
    "	</div>\n" +
    "	<div ng-if=!ContestState.canViewContest>\n" +
    "		<div layout=column layout-align=\"center center\">\n" +
    "			<span class=md-headline><i class=\"fa fa-4x fa-user-secret\" style=\"color: #455A64\" aria-hidden=true></i></span>\n" +
    "			<md-subheader>Competição Privada</md-subheader>\n" +
    "			<small style=\"color: #888\">Se registre para visualizar.</small>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "</div>\n" +
    "");
  $templateCache.put("views/contests/contest/contest.spy.html",
    "<md-dialog>\n" +
    "  <md-dialog-content>\n" +
    "    <div class=md-dialog-content>\n" +
    "      <mrt-loading-spinner ng-if=loading diameter=100></mrt-loading-spinner>\n" +
    "      \n" +
    "      <div ng-repeat=\"s in submissions\" layout=row>\n" +
    "        <p><a ui-sref=submission({id:s._id}) target=_blank><i class=\"fa fa-eye\"></i></a></p>\n" +
    "        <p>&nbsp;&nbsp;</p>\n" +
    "        <p class=verdict ng-class=verdict[s.verdict].class>{{verdict[s.verdict].text}}</p>\n" +
    "        <p>&nbsp;...&nbsp;</p>\n" +
    "        <p>{{languages[s.language]}}</p>\n" +
    "        <div flex align=right style=\"margin-left: 15px\">\n" +
    "          <p ng-bind-html=\"s.date | mrtFilterTime\">\n" +
    "        </p></div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </md-dialog-content>\n" +
    "</md-dialog>\n" +
    "");
  $templateCache.put("views/contests/contest/contest.submissions.html",
    "<div ng-controller=ContestSubmissionsController class=row>\n" +
    "  <div class=col-md-12>\n" +
    "    <table class=table>\n" +
    "      <thead>\n" +
    "        <tr class=\"submission-row submission-row-parent\">\n" +
    "          <th>Tempo</th>\n" +
    "          <th>Questão</th>\n" +
    "          <th>Linguagem</th>\n" +
    "          <th>Status</th>\n" +
    "          <th colspan=5></th>\n" +
    "        </tr>\n" +
    "      </thead>\n" +
    "      <tbody>\n" +
    "        <tr ng-repeat=\"s in ContestState.submissionsIds\" class=submission-row ng-class=verdict[ContestState.submissions[s].verdict].class>\n" +
    "          <td>{{ContestState.submissions[s].minutes}}</td>\n" +
    "          <td>\n" +
    "            <div class=balloon ng-show=\"ContestState.submissions[s].problem != null\">\n" +
    "              <img ng-src=/imgs/baloes/{{ContestState.submissions[s].index}}.png class=balloon-image>\n" +
    "              <a ui-sref=\"problems.view({id:ContestState.submissions[s].problem, index:ContestState.submissions[s].index})\" target=_blank class=balloon-label>{{ContestState.submissions[s].index | mrtAlphabetize}}</a>\n" +
    "            </div>\n" +
    "            <div class=balloon ng-hide=\"ContestState.submissions[s].problem != null\">--</div>\n" +
    "          </td>\n" +
    "          <td>{{languages[ContestState.submissions[s].language]}}</td>\n" +
    "          <td>{{verdict[ContestState.submissions[s].verdict].text}}&nbsp;<span><md-progress-circular ng-if=\"ContestState.submissions[s].verdict <= 0\" class=\"md-accent md-hue-3\" style=\"display: inline-block; top: 5px\" md-mode=indeterminate md-diameter=20></md-progress-circular></span></td>\n" +
    "          <td colspan=5><a ui-sref=submission({id:s})><i class=\"fa fa-eye\"></i></a></td>\n" +
    "        </tr>\n" +
    "      </tbody>\n" +
    "    </table>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
  $templateCache.put("views/contests/contest/contest.submit.html",
    "<div ng-controller=ContestSubmitController>\n" +
    "	<div layout=row layout-margin ng-hide=loading>\n" +
    "		<div flex=10></div>\n" +
    "		<div layout=column flex=55>\n" +
    "			<form name=form>\n" +
    "				<span>Código</span>\n" +
    "				<ui-codemirror style=\"text-align: left; cursor: text\" ui-codemirror-opts=editorOptions style=\"text-align: left\" ui-refresh=editorOptions.mode ng-model=ContestState.submit.code ng-required=!ContestState.submit.codefile></ui-codemirror>\n" +
    "				<div layout=row layout-align=\"center center\" layout-margin>\n" +
    "					<div flex=30>\n" +
    "						<b>OU</b> selecione o arquivo\n" +
    "					</div>\n" +
    "					<md-button class=\"md-raised md-accent\" flex=30 type=file ngf-select ngf-drop ng-model=ContestState.submit.codefile ngf-max-files=1 ngf-max-size=\"'64KB'\" ngf-drag-over-class=\"'md-primary md-hue-1'\" ngf-model-invalid=ContestState.submit.errorfile name=file>\n" +
    "					&nbsp;&nbsp;Arquivo<md-icon class=material-icons>attach_file</md-icon>\n" +
    "				</md-button>\n" +
    "				<div flex=40 layout-align=\"left center\">\n" +
    "					<i class=md-body-1>{{ContestState.submit.codefile.name}}</i>\n" +
    "					<i ng-show=form.file.$error.maxSize>\n" +
    "						<span>Arquivo muito grande {{ContestState.submit.errorfile.size / 1000|number:1}}KB: max 64KB<p></p>\n" +
    "						</span></i>\n" +
    "					</div>\n" +
    "					<div ngf-src=ContestState.submit.file ngf-background=ContestState.submit.file></div>\n" +
    "				</div>\n" +
    "			</form>\n" +
    "		</div>\n" +
    "		<div layout=column flex=25 layout-padding>\n" +
    "			<md-input-container>\n" +
    "				<label>Problema</label>\n" +
    "				<md-select ng-model=ContestState.submit.problem>\n" +
    "					<md-option ng-value=0>(rascunho)</md-option>\n" +
    "					<md-option ng-repeat=\"problem in ContestState.problems\" ng-value=problem._id>\n" +
    "						{{problem | mrtProblemSubmitName : $index}}\n" +
    "					</md-option>\n" +
    "				</md-select>\n" +
    "			</md-input-container>\n" +
    "			{{contest}}\n" +
    "			<md-input-container>\n" +
    "				<label>Linguagem</label>\n" +
    "				<md-select ng-model=ContestState.submit.language ng-change=updateTextMode()>\n" +
    "					<md-option ng-repeat=\"lang in ContestState.contest.languages\" ng-value=lang>\n" +
    "						{{languagesDict[lang]}}\n" +
    "					</md-option>\n" +
    "				</md-select>\n" +
    "			</md-input-container>\n" +
    "			<small ng-if=\"ContestState.submit.language === 'java'\" class=informative>\n" +
    "				Para submissões em Java, lembre-se de utilizar o nome de classe <b>Main</b>.\n" +
    "			</small>\n" +
    "			<div flex>\n" +
    "				<md-button class=\"md-fab md-primary md-hue-2\" ng-click=submit() disabled ng-disabled=\"form.$invalid || ContestState.submit.problem == null || !ContestState.submit.language\">\n" +
    "					<md-icon class=\"material-icons block\">send</md-icon>\n" +
    "				</md-button>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "		<div flex=10></div>\n" +
    "	</div>\n" +
    "	<div ng-show=loading>\n" +
    "		<mrt-loading-spinner diameter=200></mrt-loading-spinner>\n" +
    "	</div>\n" +
    "</div>\n" +
    "");
  $templateCache.put("views/contests/list/contest-list.html",
    "<mrt-page-wrapper wait-for=!loadingData ng-if=\"!notShowEmpty || contests.length > 0\">\n" +
    "  <div id=contests-list class=row>\n" +
    "    <div class=table-container>\n" +
    "      <h2 ng-if=subTitle class=orange-text>{{subTitle}}</h2>\n" +
    "      <table class=\"table table-striped\" infinite-scroll=fetchData() infinite-scroll-distance=0>\n" +
    "        <thead>\n" +
    "          <tr>\n" +
    "            <th class=col-md-3><a class=link ng-click=\"order('name')\">Nome</a></th>\n" +
    "            <th class=col-md-2><a class=link ng-click=\"order('date_start')\">Início</a></th>\n" +
    "            <th class=col-md-2><a class=link ng-click=\"order('date_end')\">Fim</a></th>\n" +
    "            <th class=col-md-1><a class=link ng-click=\"order('duration')\">Duração</a></th>\n" +
    "          </tr>\n" +
    "        </thead>\n" +
    "        <tbody>\n" +
    "          <tr class=animation ng-repeat=\"contest in contests | orderBy:predicate:reverse\">\n" +
    "            <td>\n" +
    "              <mrt-contest-label contest=contest admin-flag=\"contest.isAdmin && adminFlag\" new-flag=\"contest.isAdmin && isNewContest(contest.date_created) && newFlag\">\n" +
    "              </mrt-contest-label>\n" +
    "              <i class=\"fa fa-lock contests-view-table-icon\" ng-if=contest.isPrivate>\n" +
    "                <md-tooltip md-direction=top>Possui senha para se registrar.</md-tooltip>\n" +
    "              </i>\n" +
    "              <i class=\"fa fa-user-secret contests-view-table-icon\" ng-if=contest.watchPrivate>\n" +
    "                <md-tooltip md-direction=top>Apenas quem está registrado pode entrar no link.</md-tooltip>\n" +
    "              </i>\n" +
    "            </td>\n" +
    "            <td><mrt-display-time date=contest.date_start></mrt-display-time></td>\n" +
    "            <td><mrt-display-time date=contest.date_end></mrt-display-time></td>\n" +
    "            <td>{{contest.duration | formatDuration : true}}</td>\n" +
    "          </tr>\n" +
    "          <tr ng-hide=contests.length>\n" +
    "            <td colspan=6><span style=\"font-style: italic\">{{emptyMessage}}</span></td>\n" +
    "          </tr>\n" +
    "        </tbody>\n" +
    "      </table>\n" +
    "      <div ng-show=loadingNewPage>\n" +
    "        <mrt-loading-spinner diameter=60></mrt-loading-spinner>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "</mrt-page-wrapper>");
  $templateCache.put("views/contests/list/joined.html",
    "<mrt-breadcrumbs location=\"'Codepit / Competições'\" title=\"'Competições participadas'\">\n" +
    "</mrt-breadcrumbs>\n" +
    "\n" +
    "<div class=contests-list-wrapper>\n" +
    "  <mrt-contest-list filter-type=joined empty-message=\"'Você não criou nenhuma competição.'\" admin-flag=false new-flag=true>\n" +
    "  </mrt-contest-list>\n" +
    "</div>\n" +
    "");
  $templateCache.put("views/contests/list/open.html",
    "<mrt-breadcrumbs location=\"'Codepit / Competições'\" title=\"'Competições em aberto'\">\n" +
    "</mrt-breadcrumbs>\n" +
    "\n" +
    "<div class=contests-list-wrapper>\n" +
    "  <mrt-contest-list filter-type=joined_now sub-title=\"'Participando'\" empty-message=\"'Você não está participando de nenhuma competição que está acontecendo agora.'\" admin-flag=true not-show-empty=true ng-if=$root.user.isAuthenticated()>\n" +
    "  </mrt-contest-list>\n" +
    "  <mrt-contest-list filter-type=now sub-title=\"'Acontecendo agora'\" empty-message=\"'Nenhuma competição acontencendo.'\" admin-flag=true>\n" +
    "  </mrt-contest-list>\n" +
    "  <mrt-contest-list filter-type=future sub-title=\"'Próximas'\" empty-message=\"'Nenhuma competição futura.'\" admin-flag=true>\n" +
    "  </mrt-contest-list>\n" +
    "</div>\n" +
    "");
  $templateCache.put("views/contests/list/owned.html",
    "<mrt-breadcrumbs location=\"'Codepit / Competições'\" title=\"'Suas competições'\">\n" +
    "</mrt-breadcrumbs>\n" +
    "\n" +
    "<div class=contests-list-wrapper>\n" +
    "  <mrt-contest-list filter-type=owned empty-message=\"'Você não criou nenhuma competição.'\" admin-flag=false new-flag=true>\n" +
    "  </mrt-contest-list>\n" +
    "</div>\n" +
    "");
  $templateCache.put("views/contests/list/past.html",
    "<mrt-breadcrumbs location=\"'Codepit / Competições'\" title=\"'Competições passadas'\">\n" +
    "</mrt-breadcrumbs>\n" +
    "\n" +
    "<div class=contests-list-wrapper>\n" +
    "  <mrt-contest-list filter-type=past empty-message=\"'Nenhuma competição passada.'\" admin-flag=true>\n" +
    "  </mrt-contest-list>\n" +
    "</div>\n" +
    "");
  $templateCache.put("views/contests/settings/contest.create.html",
    "<mrt-breadcrumbs location=\"'Codepit / Competições'\" title=\"'Criar competição'\">\n" +
    "</mrt-breadcrumbs>\n" +
    "\n" +
    "<mrt-page-wrapper>\n" +
    "  <ng-include src=\"'views/contests/settings/contest.settings.html'\"></ng-include>\n" +
    "</mrt-page-wrapper>\n" +
    "");
  $templateCache.put("views/contests/settings/contest.settings.data.html",
    "<div ng-controller=ContestSettingsDataController class=contest-settings-container>\n" +
    "  <div layout=row>\n" +
    "    <div layout=column flex=60 class=settings-data>\n" +
    "      <form name=form novalidate>\n" +
    "        <div class=form-group>\n" +
    "          <input class=data-input placeholder=\"Nome da competição\" ng-model=contest.name name=name maxlength=50 required>\n" +
    "          <small class=error ng-show=\"form.name | mrtHasError\">* a competição precisa ter um nome</small>\n" +
    "        </div>\n" +
    "        <div class=form-group layout=row>\n" +
    "          <input show-button-bar=false placeholder=\"Início da competição\" class=\"data-input data-calendar-input\" uib-datepicker-popup=\"EEE, d/MMM/yyyy\" is-open=opened.start datepicker-options=options ng-model=contest.date_start ng-change=validateTimeRange() ng-click=\"openDatepicker('start')\" readonly required>\n" +
    "          <button type=button class=\"btn btn-default calendar-input\" ng-click=\"openDatepicker('start')\"><i class=\"fa fa-calendar\"></i></button>\n" +
    "          <uib-timepicker class=time-input show-spinners=false ng-model=contest.date_start ng-change=debounceValidation() hour-step=1 minute-step=5 show-meridian=false required>\n" +
    "          </uib-timepicker>\n" +
    "        </div>\n" +
    "        <div class=form-group layout=row>\n" +
    "          <input show-button-bar=false placeholder=\"Fim da competição\" class=\"data-input data-calendar-input\" uib-datepicker-popup=\"EEE, d/MMM/yyyy\" is-open=opened.end datepicker-options=options ng-model=contest.date_end ng-click=\"openDatepicker('end')\" ng-change=validateTimeRange() readonly required>\n" +
    "          <button type=button class=\"btn btn-default calendar-input\" ng-click=\"openDatepicker('end')\"><i class=\"fa fa-calendar\"></i></button>\n" +
    "          <uib-timepicker class=time-input show-spinners=false ng-model=contest.date_end ng-change=debounceValidation() hour-step=1 minute-step=5 show-meridian=false required>\n" +
    "          </uib-timepicker>\n" +
    "        </div>\n" +
    "        <div ng-if=\"contest.date_start && contest.date_end\" style=\"float: right; padding-bottom: 15px\">\n" +
    "          <small><b>Duração</b>: {{(contest.date_end - contest.date_start) / 60000 | formatDuration}}</small>\n" +
    "        </div>\n" +
    "        <div class=form-group>\n" +
    "          <button type=submit class=\"btn btn-block data-button\" ng-click=nextTab() ng-disabled=form.$invalid>Problemas &#8594;</button>\n" +
    "        </div>\n" +
    "      </form>\n" +
    "    </div>\n" +
    "    <div layout=column layout-align=\"end start\" style=\"padding: 20px\">\n" +
    "      <div><small>* As datas e horas utilizadas devem ser relativas ao horário da sua máquina:</small></div>\n" +
    "      <div><small ng-bind-html=\"timeState.server.now | mrtFilterTime\"></small></div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
  $templateCache.put("views/contests/settings/contest.settings.html",
    "<div ng-controller=ContestSettingsController>\n" +
    "  <mrt-page-wrapper wait-while=loading class=contest-view>\n" +
    "    <div layout=row>\n" +
    "      <div layout=column flex=20>\n" +
    "        <ul class=\"nav nav-tabs nav-stacked nav-pills\">\n" +
    "          <li ng-class=\"{'active': tab === 0}\">\n" +
    "            <a class=btn-lg ng-click=changeTab(0) href=\"\">Dados</a>\n" +
    "          </li>\n" +
    "          <li ng-class=\"{'active': tab === 1}\">\n" +
    "            <a class=btn-lg ng-click=changeTab(1) href=\"\">Problemas</a>\n" +
    "          </li>\n" +
    "          <li ng-class=\"{'active': tab === 2}\">\n" +
    "            <a class=btn-lg ng-click=changeTab(2) href=\"\">Opções</a>\n" +
    "          </li>\n" +
    "          <li ng-class=\"{'active': tab === 3}\">\n" +
    "            <a class=btn-lg ng-click=changeTab(3) href=\"\">\n" +
    "              <span ng-if=isEdit>Revisar e editar</span>\n" +
    "              <span ng-if=!isEdit>Revisar e criar</span>\n" +
    "            </a>\n" +
    "          </li>\n" +
    "        </ul>\n" +
    "      </div>\n" +
    "      <div layout=column flex=1>\n" +
    "        <div class=tab-content>\n" +
    "          <div ng-show=\"tab === 0\">\n" +
    "            <ng-include src=\"'views/contests/settings/contest.settings.data.html'\"></ng-include>\n" +
    "          </div>\n" +
    "          <div ng-show=\"tab === 1\">\n" +
    "            <ng-include src=\"'views/contests/settings/contest.settings.problems.html'\"></ng-include>\n" +
    "          </div>\n" +
    "          <div ng-show=\"tab === 2\">\n" +
    "            <ng-include src=\"'views/contests/settings/contest.settings.options.html'\"></ng-include>\n" +
    "          </div>\n" +
    "          <div ng-show=\"tab === 3\">\n" +
    "            <ng-include src=\"'views/contests/settings/contest.settings.review.html'\"></ng-include>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </mrt-page-wrapper>\n" +
    "</div>\n" +
    "");
  $templateCache.put("views/contests/settings/contest.settings.options.html",
    "<div ng-controller=ContestSettingsDataController class=contest-settings-container>\n" +
    "  <div layout=column flex=60>\n" +
    "    <form name=form novalidate>\n" +
    "      <md-subheader>Frozen&nbsp;\n" +
    "        <i class=\"fa fa-question\">\n" +
    "          <md-tooltip md-direction=top>\n" +
    "            <p>O <b>frozen</b> define o momento da competição em que o placar<br>congela, e o competidor só tem acesso ao resultado de suas<br>próprias submissões. Nas competições clássicas, o frozen<br>começa na última hora da competição.</p>\n" +
    "          </md-tooltip>\n" +
    "        </i>\n" +
    "      </md-subheader>\n" +
    "      <div layout=row>\n" +
    "        <div class=settings-options layout=row layout-align=\"center center\" flex=45>\n" +
    "          <div><span>não</span></div>\n" +
    "          <div>\n" +
    "            <md-switch class=md-primary ng-model=contest.hasFrozen ng-disabled=\"!contest.date_start || !contest.date_end\" ng-change=validateTimeRange()></md-switch>\n" +
    "          </div>\n" +
    "          <div><span>sim</span></div>\n" +
    "        </div>\n" +
    "        <div layout=column ng-if=contest.hasFrozen>\n" +
    "          <div class=form-group layout=row>\n" +
    "            <input show-button-bar=false placeholder=\"Início do frozen\" class=\"data-input data-calendar-input\" uib-datepicker-popup=\"EEE, d/MMM/yyyy\" is-open=opened.frozen datepicker-options=options ng-model=contest.frozen_time ng-change=validateTimeRange() ng-click=\"openDatepicker('frozen')\" readonly>\n" +
    "            <button type=button class=\"btn btn-default calendar-input\" ng-click=\"openDatepicker('frozen')\"><i class=\"fa fa-calendar\"></i></button>\n" +
    "            <uib-timepicker class=time-input show-spinners=false ng-model=contest.frozen_time ng-change=debounceValidation() hour-step=1 minute-step=5 show-meridian=false required>\n" +
    "            </uib-timepicker>\n" +
    "          </div>\n" +
    "          <div>\n" +
    "            <small><b>Duração do frozen</b>: {{(contest.date_end - contest.frozen_time) / 60000 | formatDuration}}</small>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <small class=error ng-show=\"!contest.date_start || !contest.date_end\">* você deve configurar o início e o fim da competição para poder definir esta opção</small>\n" +
    "      <md-divider></md-divider>\n" +
    "\n" +
    "\n" +
    "      <md-subheader>Blind&nbsp;\n" +
    "        <i class=\"fa fa-question\">\n" +
    "          <md-tooltip md-direction=top>\n" +
    "            <p>O <b>blind</b> define o momento da competição em que tudo<br>congela, e o competidor não tem mais acesso a nenhum<br>resultado. Nas competições clássicas, o blind começa<br>nos últimos 15 minutos de competição.</p>\n" +
    "          </md-tooltip>\n" +
    "        </i>\n" +
    "      </md-subheader>\n" +
    "      <div layout=row>\n" +
    "        <div class=settings-options layout=row layout-align=\"center center\" flex=45>\n" +
    "          <div><span>não</span></div>\n" +
    "          <div>\n" +
    "            <md-switch class=md-primary ng-model=contest.hasBlind ng-disabled=\"!contest.date_start || !contest.date_end\" ng-change=validateTimeRange()></md-switch>\n" +
    "          </div>\n" +
    "          <div><span>sim</span></div>\n" +
    "        </div>\n" +
    "        <div layout=column ng-if=contest.hasBlind>\n" +
    "          <div class=form-group layout=row>\n" +
    "            <input show-button-bar=false placeholder=\"Início do blind\" class=\"data-input data-calendar-input\" uib-datepicker-popup=\"EEE, d/MMM/yyyy\" is-open=opened.blind datepicker-options=options ng-model=contest.blind_time ng-change=validateTimeRange() ng-click=\"openDatepicker('blind')\" readonly>\n" +
    "            <button type=button class=\"btn btn-default calendar-input\" ng-click=\"openDatepicker('blind')\"><i class=\"fa fa-calendar\"></i></button>\n" +
    "            <uib-timepicker class=time-input show-spinners=false ng-model=contest.blind_time ng-change=debounceValidation() hour-step=1 minute-step=5 show-meridian=false required>\n" +
    "            </uib-timepicker>\n" +
    "          </div>\n" +
    "          <div>\n" +
    "            <small><b>Duração do blind</b>: {{(contest.date_end - contest.blind_time) / 60000 | formatDuration}}</small>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <small class=error ng-show=\"!contest.date_start || !contest.date_end\">* você deve configurar o início e o fim da competição para poder definir esta opção</small>\n" +
    "      <md-divider></md-divider>\n" +
    "\n" +
    "\n" +
    "      <md-subheader>Senha&nbsp;\n" +
    "        <i class=\"fa fa-question\">\n" +
    "          <md-tooltip md-direction=top>\n" +
    "            <p>Senha para participar da competição.</p>\n" +
    "          </md-tooltip>\n" +
    "        </i>\n" +
    "      </md-subheader>\n" +
    "      <div layout=row>\n" +
    "        <div class=settings-options layout=row layout-align=\"center center\" flex=45>\n" +
    "          <div><span><i class=\"fa fa-unlock\" style=\"display: inline\"></i>&nbsp;Público</span></div>\n" +
    "          <div>\n" +
    "            <md-switch class=md-primary ng-model=contest.isPrivate></md-switch>\n" +
    "          </div>\n" +
    "          <div><span><i class=\"fa fa-lock\" style=\"display: inline\"></i>&nbsp;Privado</span></div>\n" +
    "        </div>\n" +
    "        <div class=form-group style=\"padding-right: 8px\" ng-if=contest.isPrivate flex>\n" +
    "          <input type=password name=password ng-model=contest.password class=data-input placeholder=Senha ng-maxlength=100 required>\n" +
    "          <small class=error ng-show=\"form.password | mrtHasError\">* a senha deve ter entre 1 e 100 caracteres</small>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <md-divider></md-divider>\n" +
    "\n" +
    "      <md-subheader>Visualização&nbsp;\n" +
    "        <i class=\"fa fa-question\">\n" +
    "          <md-tooltip md-direction=top>\n" +
    "            <p>Visualização aberta permite que todos possam acessar<br>os problemas e o placar da competição, enquanto que<br>visualização para participantes permite que apenas os que<br>estão participando tenham acesso.</p>\n" +
    "          </md-tooltip>\n" +
    "        </i>\n" +
    "      </md-subheader>\n" +
    "      <div layout=row>\n" +
    "        <div class=settings-options layout=row layout-align=\"center center\" flex=45>\n" +
    "          <div><span><i class=\"fa fa-globe\" style=\"display: inline\"></i>&nbsp;Aberto</span></div>\n" +
    "          <div>\n" +
    "            <md-switch class=md-primary ng-model=contest.watchPrivate></md-switch>\n" +
    "          </div>\n" +
    "          <div><span><i class=\"fa fa-user-secret\" style=\"display: inline\"></i>&nbsp;Participantes</span></div>\n" +
    "        </div>\n" +
    "        <div flex></div>\n" +
    "      </div>\n" +
    "      <md-divider></md-divider>\n" +
    "\n" +
    "      <md-subheader>Participantes&nbsp;\n" +
    "        <i class=\"fa fa-question\">\n" +
    "          <md-tooltip md-direction=top>\n" +
    "            <p>Que configurações podem participar da competição:<br>apenas em time, apenas individualmente ou ambos.</p>\n" +
    "          </md-tooltip>\n" +
    "        </i>\n" +
    "      </md-subheader>\n" +
    "      <div layout=row>\n" +
    "        <div class=\"settings-options checkbox\" layout=column flex=45>\n" +
    "          <md-checkbox class=md-primary ng-model=contest.allowIndividual aria-label=Individual>\n" +
    "            <span><i class=\"fa fa-user\" style=\"display: inline\"></i>&nbsp;Individual</span>\n" +
    "          </md-checkbox>\n" +
    "          <md-checkbox class=md-primary ng-model=contest.allowTeam aria-label=Individual>\n" +
    "            <span><i class=\"fa fa-users\" style=\"display: inline\"></i>&nbsp;Times</span>\n" +
    "          </md-checkbox>\n" +
    "          <small class=error ng-show=\"!contest.allowIndividual && !contest.allowTeam\">* você deve escolher ao menos uma das opções acima</small>\n" +
    "        </div>\n" +
    "        <div flex></div>\n" +
    "      </div>\n" +
    "      \n" +
    "\n" +
    "    </form>\n" +
    "    <div class=form-group style=\"margin-top: 15px\">\n" +
    "      <button type=submit class=\"btn btn-block data-button\" ng-click=nextTab() ng-disabled=\"form.$invalid || (!contest.allowIndividual && !contest.allowTeam)\">\n" +
    "        <span ng-if=isEdit>Revisar e editar</span>\n" +
    "        <span ng-if=!isEdit>Revisar e criar</span>\n" +
    "        &nbsp;&#8594;\n" +
    "      </button>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
  $templateCache.put("views/contests/settings/contest.settings.problems.html",
    "<div ng-controller=ContestSettingsProblemsController class=contest-settings-container>\n" +
    "  <div layout=row layout-align=\"space-around top\">\n" +
    "    <div flex=60>\n" +
    "      <form name=form novalidate>\n" +
    "        <md-autocomplete placeholder=Buscar md-input-name=autocomplete md-search-text=searchText md-selected-item=selectedProblem md-selected-item-change=select() md-items=\"problem in getProblems()\" md-item-text=problem.name md-min-length=3 md-no-cache ng-disabled=\"contest.problems.length >= 26\">\n" +
    "          <md-item-template>\n" +
    "            <span>{{problem.fullName}}</span>\n" +
    "          </md-item-template>\n" +
    "          <md-not-found>\n" +
    "            Nenhum problema encontrado.\n" +
    "          </md-not-found>\n" +
    "        </md-autocomplete>\n" +
    "        <md-subheader class=md-no-sticky style=\"margin-top: 5px\">Problemas&nbsp;\n" +
    "          <i class=\"fa fa-question\">\n" +
    "            <md-tooltip md-direction=top>\n" +
    "              <p>Atualmente o Codepit suporta problemas dos seguintes juízes:<br>\n" +
    "                - Codeforces (www.codeforces.com)<br>\n" +
    "                - Codeforces Gym (www.codeforces.com/gyms)<br>\n" +
    "                - CodeChef (www.codechef.com)<br>\n" +
    "                - Huxley (www.thehuxley.com)<br>\n" +
    "                - Kattis (open.kattis.com)<br>\n" +
    "                - LiveArchive (icpcarchive.ecs.baylor.edu)<br>\n" +
    "                - POJ (poj.org)<br>\n" +
    "                - Spoj (www.spoj.com)<br>\n" +
    "                - SpojBR (br.spoj.com)<br>\n" +
    "                - Timus (acm.timus.ru)<br>\n" +
    "                - TOJ (acm.tju.edu.cn)<br>\n" +
    "                - URI (www.urionlinejudge.com.br)<br>\n" +
    "                - OnlineJudge (onlinejudge.org)<br>\n" +
    "                - ZOJ (acm.zju.edu.cn)\n" +
    "              </p>\n" +
    "            </md-tooltip>\n" +
    "          </i>\n" +
    "        </md-subheader>\n" +
    "        <md-list ui-sortable=sortableOptions ng-model=contest.problems>\n" +
    "          <md-list-item class=md-3-line ng-repeat=\"problem in contest.problems\">\n" +
    "            <div class=\"md-list-item-text move-handle\" layout=column flex=5>\n" +
    "              <i class=\"fa fa-bars\" aria-hidden=true></i>\n" +
    "            </div>\n" +
    "            <div class=balloon-ps>\n" +
    "              <img ng-src=/imgs/baloes/{{$index}}.png class=md-avatar>\n" +
    "              <a ui-sref=problems.view({id:problem._id,index:$index}) target=_blank class=\"balloon-ps-label md-avatar\">{{$index | mrtAlphabetize}}</a>\n" +
    "            </div>\n" +
    "            <div class=md-list-item-text layout=column flex layout-align=\"center start\">\n" +
    "              <h3 style=\"white-space: normal; text-align: left\">{{ problem.name }}</h3>\n" +
    "              <h4>{{ problem.oj | mrtOjName }} {{ problem.id }}</h4>\n" +
    "            </div>\n" +
    "            <div class=md-list-item-text layout=column flex=15>\n" +
    "              <p ng-if=\"problem.timelimit !== 'undefined'\">{{ problem.timelimit }}s</p>\n" +
    "              <p ng-if=\"problem.memorylimit !== 'undefined'\">{{ problem.memorylimit }}</p>\n" +
    "            </div>\n" +
    "            <div class=\"md-list-item-text remove-problem\" layout=column flex=5>\n" +
    "              <i class=\"fa fa-times\" aria-hidden=true ng-click=removeProblem(problem._id)></i>\n" +
    "            </div>\n" +
    "          </md-list-item>\n" +
    "        </md-list>\n" +
    "        <small ng-if=!contest.problems.length class=\"informative error\">* Você deve inserir ao menos um problema.</small>\n" +
    "        <small ng-if=noLanguagesAvailable() class=\"informative error\">* A competição deve suportar ao menos uma linguagem.</small>\n" +
    "        <div class=form-group>\n" +
    "          <button type=submit class=\"btn btn-block data-button\" ng-click=nextTab() ng-disabled=\"noLanguagesAvailable() || contest.problems.length === 0\">\n" +
    "            Opções &#8594;\n" +
    "          </button>\n" +
    "        </div>\n" +
    "      </form>\n" +
    "    </div>\n" +
    "    <div flex=20>\n" +
    "      <md-subheader class=md-no-sticky style=\"margin-top: 5px\">Linguagens&nbsp;\n" +
    "        <i class=\"fa fa-question\">\n" +
    "          <md-tooltip md-direction=top>\n" +
    "            <p>As linguagens permitidas durante a competição.</p>\n" +
    "          </md-tooltip>\n" +
    "        </i>\n" +
    "      </md-subheader>\n" +
    "      <div ng-repeat=\"(key,lang) in Languages\">\n" +
    "        <md-checkbox ng-checked=checkLang(key,1) ng-disabled=checkLang(key,-1) ng-click=toggleLang(key)>\n" +
    "          {{ lang }}\n" +
    "        </md-checkbox>\n" +
    "      </div>\n" +
    "      <small ng-if=\"totalForbid > 0\" class=informative>* Um ou mais problemas inseridos não suportam certas linguagens e estas foram, portanto, desabilitadas.</small>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
  $templateCache.put("views/contests/settings/contest.settings.review.html",
    "<div ng-controller=ContestSettingsDataController class=contest-settings-container>\n" +
    "  <div ng-hide=validateForm()>\n" +
    "    <small class=error>Há correções pendentes. Por favor, navegue nas abas de Dados, Problemas e Opções para ver o que está faltando.</small>\n" +
    "  </div>\n" +
    "  <div ng-show=validateForm()>\n" +
    "    <md-subheader>Dados</md-subheader>\n" +
    "    <div layout=column>\n" +
    "      <div layout=row>\n" +
    "        <div flex=10><b>Nome</b></div>\n" +
    "        <div flex><p>{{contest.name}}</p></div>\n" +
    "      </div>\n" +
    "      <div layout=row>\n" +
    "        <div flex=10><b>Início</b></div>\n" +
    "        <div flex><p ng-bind-html=\"contest.date_start | mrtFilterTime\"></p></div>\n" +
    "      </div>\n" +
    "      <div layout=row>\n" +
    "        <div flex=10><b>Fim</b></div>\n" +
    "        <div flex><p ng-bind-html=\"contest.date_end | mrtFilterTime\"></p></div>\n" +
    "      </div>\n" +
    "      <div layout=row>\n" +
    "        <div flex=10><b>Duração</b></div>\n" +
    "        <div flex><p>{{(contest.date_end - contest.date_start) / 60000 | formatDuration}}</p></div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <md-subheader>Problemas</md-subheader>\n" +
    "    <div layout=row ng-repeat=\"problem in contest.problems\">\n" +
    "      <div flex><p><b>({{$index | mrtAlphabetize}})</b> <a ui-sref=problems.view({id:problem._id,index:$index}) target=_blank>{{problem.fullName}}</a></p></div>\n" +
    "    </div>\n" +
    "    <md-subheader>Informações</md-subheader>\n" +
    "    <div layout=column>\n" +
    "      <div>\n" +
    "        Linguagens permitidas: {{contest.languages | mrtParseLanguages}}\n" +
    "      </div>\n" +
    "      <div ng-if=\"contest.hasFrozen || contest.hasBlind\" style=\"padding-bottom: 20px\">\n" +
    "        <div ng-show=contest.hasFrozen>\n" +
    "          O modo <b>frozen</b> começará <span ng-bind-html=\"contest.frozen_time | mrtFilterTime\"></span>, faltando {{(contest.date_end - contest.frozen_time) / 60000 | formatDuration}} para o término da competição.\n" +
    "        </div>\n" +
    "        <div ng-show=contest.hasBlind>\n" +
    "          O modo <b>blind</b> começará <span ng-bind-html=\"contest.blind_time | mrtFilterTime\"></span>, faltando {{(contest.date_end - contest.blind_time) / 60000 | formatDuration}} para o término da competição.\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <div>\n" +
    "        <span ng-show=contest.isPrivate><i class=\"fa fa-lock\" style=\"display: inline\"></i>&nbsp;A competição <b>possui senha</b> para participar.</span>\n" +
    "        <span ng-hide=contest.isPrivate><i class=\"fa fa-unlock\" style=\"display: inline\"></i>&nbsp;A competição <b>não possui senha</b> para participar.</span>\n" +
    "      </div>\n" +
    "      <div>\n" +
    "        <span ng-show=contest.watchPrivate><i class=\"fa fa-user-secret\" style=\"display: inline\"></i>&nbsp;Apenas <b>quem está participando pode acompanhar</b> a competição.</span>\n" +
    "        <span ng-hide=contest.watchPrivate><i class=\"fa fa-globe\" style=\"display: inline\"></i>&nbsp;A competição é <b>aberta para qualquer pessoa acompanhar</b>.</span>\n" +
    "      </div>\n" +
    "      <div>\n" +
    "        <span ng-show=\"contest.allowIndividual && !contest.allowTeam\">\n" +
    "          <i class=\"fa fa-user\" style=\"display: inline\"></i>&nbsp;Usuários podem participar da competição apenas <b>individualmente</b>.\n" +
    "        </span>\n" +
    "        <span ng-show=\"!contest.allowIndividual && contest.allowTeam\">\n" +
    "          <i class=\"fa fa-users\" style=\"display: inline\"></i>&nbsp;Usuários podem participar da competição apenas <b>em time</b>.\n" +
    "        </span>\n" +
    "        <span ng-show=\"contest.allowIndividual && contest.allowTeam\">\n" +
    "          <i class=\"fa fa-user\" style=\"display: inline\"></i><i class=\"fa fa-users\" style=\"display: inline\"></i>&nbsp;Usuários podem participar da competição <b>individualmente</b> ou <b>em time</b>.\n" +
    "        </span>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div flex=50>\n" +
    "      <div vc-recaptcha ng-model=contest.recaptcha style=\"margin: 0 auto; padding: 20px 0 20px 0; width: 304px\"></div>\n" +
    "      <div class=form-group>\n" +
    "        <button type=submit class=\"btn btn-block data-button\" ng-click=createOrEdit() ng-disabled=!contest.recaptcha>\n" +
    "          <span ng-if=isEdit>Editar competição</span>\n" +
    "          <span ng-if=!isEdit>Criar competição</span>\n" +
    "        </button>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
  $templateCache.put("views/footer.html",
    "<footer id=footer class=no-print>\n" +
    "	<div id=footer-arrow></div>\n" +
    "	<div class=container>\n" +
    "		<div class=row>\n" +
    "			<div class=col-md-12>\n" +
    "				<ul>\n" +
    "					<li><a ui-sref=home>Home</a></li>\n" +
    "					<li><a ui-sref=contests.open>Competições</a></li>\n" +
    "					<li><a ui-sref=about>Sobre o Codepit</a></li>\n" +
    "					<li ng-hide=$root.user.isAuthenticated()><a ui-sref=register>Registre-se</a></li>\n" +
    "				</ul>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "\n" +
    "	<div id=footer-bottom layout=row>\n" +
    "		<div layout=column layout-align=\"center start\" flex=5>\n" +
    "			<a target=_blank href=//fb.com/codepitio><i class=\"fa fa-facebook\"></i></a>\n" +
    "		</div>\n" +
    "		<div layout=column layout-align=\"center start\" flex>\n" +
    "			<h4>Codepit © Copyright 2015-2017 Gustavo Stor</h4>\n" +
    "		</div>\n" +
    "		<div layout=column layout-align=\"center end\" flex=20>\n" +
    "			<img class=codepit-logo src=../imgs/codepit-full.png>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "</footer>\n" +
    "");
  $templateCache.put("views/header.html",
    "<header id=header class=no-print>\n" +
    "  <div class=bs-component>\n" +
    "    <div class=\"navbar navbar-default\">\n" +
    "      <div class=container-fluid>\n" +
    "        <div class=navbar-header>\n" +
    "          <button type=button class=navbar-toggle data-toggle=collapse data-target=.navbar-responsive-collapse>\n" +
    "            <span class=icon-bar></span>\n" +
    "            <span class=icon-bar></span>\n" +
    "            <span class=icon-bar></span>\n" +
    "            <span class=icon-bar></span>\n" +
    "          </button>\n" +
    "          <a class=navbar-brand ui-sref=home></a>\n" +
    "        </div>\n" +
    "        <div class=\"navbar-collapse navbar-responsive-collapse collapse\" aria-expanded=false>\n" +
    "          <ul class=\"nav navbar-nav\">\n" +
    "            <li class=dropdown>\n" +
    "              <a data-toggle=dropdown class=\"dropdown-toggle link\" ng-class=\"{'active': isActive('/contest.*')}\" aria-expanded=false>\n" +
    "                Competições\n" +
    "                <span class=caret></span>\n" +
    "              </a>\n" +
    "              <ul class=dropdown-menu>\n" +
    "                <li><a ui-sref=contests.open>Em aberto</a></li>\n" +
    "                <li><a ui-sref=contests.past>Passadas</a></li>\n" +
    "                <li ng-show=$root.user.isAuthenticated() class=divider></li>\n" +
    "                <li ng-show=$root.user.isAuthenticated()><a ui-sref=contests.owned>Criadas</a></li>\n" +
    "                <li ng-show=$root.user.isAuthenticated()><a ui-sref=contests.joined>Participadas</a></li>\n" +
    "                <li ng-show=\"$root.user.isAuthenticated() && $root.user.isVerified()\" class=divider></li>\n" +
    "                <li ng-show=\"$root.user.isAuthenticated() && $root.user.isVerified()\"><a ui-sref=contests.create>Criar competição</a></li>\n" +
    "              </ul>\n" +
    "            </li>\n" +
    "          </ul>\n" +
    "          <mrt-login-form></mrt-login-form>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div id=source-button class=\"btn btn-primary btn-xs\" style=\"display: none\">&lt; &gt;</div>\n" +
    "  </div>\n" +
    "</header>\n" +
    "");
  $templateCache.put("views/home.html",
    "<mrt-breadcrumbs location=\"'Codepit'\" title=\"'Home'\">\n" +
    "</mrt-breadcrumbs>\n" +
    "\n" +
    "<mrt-blog-posts page-path=\"'home'\"></mrt-blog-posts>\n" +
    "");
  $templateCache.put("views/misc/blog-posts.html",
    "<mrt-page-wrapper wait-while=loading>\n" +
    "  <div class=blog-container>\n" +
    "    <div ng-if=!!page.posts.length>\n" +
    "      <div ng-repeat=\"post in page.posts\">\n" +
    "        <div class=blog-section ng-class=\"{'first': $index == 0, 'single': isInfo}\">\n" +
    "          <div ng-if=!isInfo class=blog-header>{{post.title}}\n" +
    "            <p class=pull-right style=\"font-style: italic; font-size: 12px; margin: 0px\"><mrt-display-time date=post.createdAt></mrt-display-time></p>\n" +
    "            <p class=pull-right style=\"font-style: italic; font-size: 12px; clear:right; margin: 0px\"><a class=unrated-handle ui-sref=\"profile({id: post.author._id})\">{{post.author.local.username}}</a></p>\n" +
    "          </div>\n" +
    "          <hr ng-if=!isInfo class=blog-header-separator>\n" +
    "          <div class=blog-body ng-bind-html=post.body></div>\n" +
    "          <a ng-if=\"post.author._id === $root.user.getId()\" style=\"cursor: pointer\" ng-click=editPost(post)><i class=\"fa fa-cog fa-2x\" aria-hidden=true></i></a>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <div ng-if=!isInfo class=\"blog-section last\" style=\"text-align: center\">\n" +
    "        <uib-pagination total-items=page.total ng-model=page.current items-per-page=page.maxDisplay class=pagination-md boundary-link-numbers=true rotate=false ng-change=changePage() max-size=5 previous-text=\"<\" next-text=\">\"></uib-pagination>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div ng-if=!page.posts.length>\n" +
    "      <div class=\"blog-section single\" style=\"text-align: center\">\n" +
    "        <span class=empty-blog>Não há nenhum post&nbsp;&nbsp;&nbsp;<div class=rotate90>:(</div></span>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</mrt-page-wrapper>\n" +
    "");
  $templateCache.put("views/misc/breadcrumbs.html",
    "<div id=breadcrumbs layout=row class=no-print>\n" +
    "  <div flex>\n" +
    "    <span>{{location}}</span>\n" +
    "    <h2>{{title}}</h2>\n" +
    "  </div>\n" +
    "  <div layout=row layout-align=\"center center\" flex=5>\n" +
    "    <md-button class=md-icon-button ng-click=close() style=\"margin-top: 5px\" mrt-go-back>\n" +
    "      <md-icon class=material-icons style=color:grey>keyboard_return</md-icon>\n" +
    "    </md-button>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
  $templateCache.put("views/misc/contest-label.html",
    "<a ui-sref=contest.scoreboard({id:contest._id})>{{contest.name}}</a>\n" +
    "<span ng-if=adminFlag class=team-admin>&nbsp;(admin)</span>\n" +
    "<sup ng-if=newFlag style=\"color: #F55; font-size: 8px\">&nbsp;NOVA</sup>\n" +
    "");
  $templateCache.put("views/misc/contest-progress.html",
    "<div>\n" +
    "  <div ng-show=!hasContestEnded() style=\"margin-bottom: 10px\" align=center>\n" +
    "    <span style=\"font-weight: 200; font-size: 18px\">Tempo: {{getUptime()}}</span>\n" +
    "  </div>\n" +
    "  <div ng-show=hasContestEnded() style=\"font-weight: 200; font-size: 18px; margin-bottom: 10px\" layout=row layout-align=\"center center\">\n" +
    "    <div flex><span>Duração: {{getTotalTime()}}</span></div>\n" +
    "    <div flex layout=row layout-align=\"end center\">\n" +
    "      <div>Upsolving\n" +
    "        <sup>\n" +
    "          <i class=\"fa fa-question\">\n" +
    "            <md-tooltip md-direction=top>\n" +
    "              <p>Selecione <b>Upsolving</b> para visualizar o placar pós-<br>competição, o que não conta para o placar oficial.</p>\n" +
    "            </md-tooltip>\n" +
    "          </i>\n" +
    "        </sup>\n" +
    "        &nbsp;&nbsp;\n" +
    "      </div>\n" +
    "      <div><md-switch class=md-primary ng-model=ContestState.upsolving ng-change=ContestState.changeUpsolving()></md-switch></div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div ng-show=\"previewBar || isContestRunning()\" layout=row md-theme=progressBarTheme style=\"width:100%; position: relative\">\n" +
    "    <md-progress-linear ng-class=getClass() md-mode=determinate ng-value=getPercentage()></md-progress-linear>\n" +
    "    <div ng-show=\"showBar('frozen')\" class=\"preview-bar frozen-bar\" ng-style=\"{'width': getWidthOf('frozen')+'%'}\">\n" +
    "      <md-tooltip md-direction=bottom>Modo <b>frozen</b></md-tooltip>\n" +
    "    </div>\n" +
    "    <div ng-show=\"showBar('blind')\" class=\"preview-bar blind-bar\" ng-style=\"{'width': getWidthOf('blind')+'%'}\">\n" +
    "      <md-tooltip md-direction=bottom>Modo <b>blind</b></md-tooltip>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div ng-show=isContestRunning()>\n" +
    "    <span style=\"float: right; font-weight: 200\">restam {{getTimeLeft()}}</span>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
  $templateCache.put("views/misc/home-create-account.html",
    "<section id=new-user-action>\n" +
    "  <div class=container ng-hide=$root.user.isAuthenticated()>\n" +
    "    <div class=row>\n" +
    "      <div id=action-info class=col-sm-7>\n" +
    "        <img src=imgs/action_logo.png>\n" +
    "        <h2>Crie e participe de <strong>competições de programação</strong> individuais ou em time.</h2>\n" +
    "        <a class=link>Saiba mais</a>\n" +
    "      </div>\n" +
    "      <div class=\"col-sm-5 form-box\">\n" +
    "        <div class=form-top>\n" +
    "          <div class=form-top-left>\n" +
    "            <h3>Crie sua conta</h3>\n" +
    "              <p>Preencha os campos abaixo para entrar no Codepit</p>\n" +
    "          </div>\n" +
    "          <div class=form-top-right>\n" +
    "            <i class=\"fa fa-user\"></i>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "        <div class=form-bottom>\n" +
    "            <form role=form action=\"\" method=post>\n" +
    "              <table class=profile-table>\n" +
    "                <tbody>\n" +
    "                  <tr>\n" +
    "                    <td>\n" +
    "                      <input class=form-control ng-model=user.name name=name placeholder=Nome ng-maxlength=100>\n" +
    "                    </td>\n" +
    "                    <td>\n" +
    "                      <input class=form-control ng-model=user.surname name=surname placeholder=Sobrenome ng-maxlength=100>\n" +
    "                    </td>\n" +
    "                  </tr>\n" +
    "                  <tr>\n" +
    "                    <td colspan=2><input type=email class=form-control ng-model=user.email name=email placeholder=\"Email *\" required></td>\n" +
    "                  </tr>\n" +
    "                  <tr>\n" +
    "                    <td colspan=2><input id=usernameInput data-toggle=tooltip title=\"Este nome aparecerá no placar das competições, quando você competir individualmente.\" class=form-control ng-model=user.username name=username placeholder=\"Nome de perfil *\" ng-maxlength=30 tooltip required></td>\n" +
    "                  </tr>\n" +
    "                  <tr>\n" +
    "                    <td><input type=password class=form-control ng-model=user.password placeholder=\"Senha *\" data-toggle=tooltip name=pass ng-maxlength=50 tooltip required></td>\n" +
    "                    <td><input type=password class=form-control ng-model=user.confirmPassword placeholder=\"Repita senha *\" name=confirmPass match-field={{user.password}} ng-maxlength=50></td>\n" +
    "                  </tr>\n" +
    "                  <tr>\n" +
    "                    <td colspan=2>\n" +
    "                      <button type=button ng-click=register() class=\"btn btn-default btn-block\" ng-disabled=registerProfileForm.$invalid>Registrar</button>\n" +
    "                    </td>\n" +
    "                  </tr>\n" +
    "                </tbody>\n" +
    "              </table>\n" +
    "            </form>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</section>\n" +
    "");
  $templateCache.put("views/misc/loading-spinner.html",
    "<div layout=row layout-sm=column layout-align=space-around>\n" +
    "  <md-progress-circular md-mode=indeterminate md-diameter={{diameter}}></md-progress-circular>\n" +
    "</div>\n" +
    "");
  $templateCache.put("views/misc/page-wrapper.html",
    "<div id=wrapper class=container-fluid style=\"padding: 30px\">\n" +
    "	<div ng-hide=\"waitFor && !waitWhile\">\n" +
    "		<mrt-loading-spinner diameter=diameter></mrt-loading-spinner>\n" +
    "	</div>\n" +
    "  <div class=col-md-12 ng-show=\"waitFor && !waitWhile\" ng-transclude></div>\n" +
    "</div>\n" +
    "");
  $templateCache.put("views/misc/pdf-viewer.html",
    "<div id=problem-pdf-container class=\"pdfViewer singlePageView\">\n" +
    "");
  $templateCache.put("views/problem-view.html",
    "<mrt-breadcrumbs location=\"'Codepit / Problemas / ' + problem.oj\" title=problem.name>\n" +
    "</mrt-breadcrumbs>\n" +
    "\n" +
    "<mrt-page-wrapper>\n" +
    "  <div class=problem-statement ng-if=\"problem.timelimit || problem.memorylimit\">\n" +
    "    <div class=\"header title print\">\n" +
    "      <span>{{problem.printName}}</span>\n" +
    "    </div>\n" +
    "    <div class=\"header metadata\">\n" +
    "        <span ng-if=problem.timelimit>Time limit: {{problem.timelimit}}s</span>\n" +
    "        <span ng-if=problem.memorylimit>Memory limit: {{problem.memorylimit}}</span>\n" +
    "        <span ng-if=problem.inputFile>Input: <b>{{problem.inputFile}}</b></span>\n" +
    "        <span ng-if=problem.outputFile>Output: <b>{{problem.outputFile}}</b></span>\n" +
    "        <span class=\"print-button no-print\"><a class=small href=\"\" ng-click=print() target=_blank>[imprimir]</a></span>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div ng-hide=problem.imported>\n" +
    "    <div class=blog-container>\n" +
    "      <div class=\"blog-section single\" style=\"text-align: center\">\n" +
    "        <div class=empty-blog>O <i>html</i> ou <i>pdf</i> deste problema ainda não foi importado!&nbsp;&nbsp;&nbsp;<div class=rotate90>:(</div></div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div ng-show=problem.imported>\n" +
    "    <div ng-if=!problem.isPdf>\n" +
    "      <ui-view></ui-view>\n" +
    "    </div>\n" +
    "    <div ng-if=problem.isPdf class=problem-pdf-wrapper>\n" +
    "      <mrt-pdf url={{problem.url}} containerid=problem-pdf-container></mrt-pdf>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=problem-statement ng-if=problem.source>\n" +
    "    <p class=footer ng-bind-html=problem.source></p>\n" +
    "  </div>\n" +
    "  <div style=\"margin-top: 20px; float: right\" class=no-print>\n" +
    "    <a class=\"small link\" ng-click=\"openPage(problem.originalUrl || problem.url)\">[link original]</a>\n" +
    "  </div>\n" +
    "</mrt-page-wrapper>\n" +
    "");
  $templateCache.put("views/submission.html",
    "<mrt-breadcrumbs location=\"'Codepit'\" title=\"'Submissão'\">\n" +
    "</mrt-breadcrumbs>\n" +
    "\n" +
    "<mrt-page-wrapper wait-for=submission>\n" +
    "  <div layout=row>\n" +
    "    <div layout=column layout-align=\"center center\" flex>\n" +
    "      <md-subheader>Problema</md-subheader>\n" +
    "      <p><a ui-sref=problems.view({id:submission.problem._id})>{{submission.problem.name}}</a></p>\n" +
    "    </div>\n" +
    "    <div layout=column layout-align=\"center center\" flex>\n" +
    "      <md-subheader>Contest</md-subheader>\n" +
    "      <p><a ui-sref=contest.scoreboard({id:submission.contest._id})>{{submission.contest.name}}</a></p>\n" +
    "    </div>\n" +
    "    <div layout=column layout-align=\"center center\" flex>\n" +
    "      <md-subheader>Usuário</md-subheader>\n" +
    "      <p><a class=unrated-handle ui-sref=profile({id:submission.contestant._id})>{{submission.contestant.local.username}}</a></p>\n" +
    "    </div>\n" +
    "    <div layout=column layout-align=\"center center\" flex>\n" +
    "      <md-subheader>Veredito</md-subheader>\n" +
    "      <p class=verdict ng-class=verdict[submission.verdict].class>{{verdict[submission.verdict].text}}</p>\n" +
    "    </div>\n" +
    "    <div layout=column layout-align=\"center center\" flex>\n" +
    "      <md-subheader>Data</md-subheader>\n" +
    "      <mrt-display-time date=submission.date></mrt-display-time>\n" +
    "    </div>\n" +
    "    <div layout=column layout-align=\"center center\" flex>\n" +
    "      <md-subheader>Linguagem</md-subheader>\n" +
    "      <p>{{languages[submission.language]}}</p>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <input type=hidden ng-model=submission.code>\n" +
    "  <div class=submission>\n" +
    "    <ui-codemirror ng-model=submission.code class=test style=\"text-align: left; cursor: text\" ui-codemirror-opts=editorOptions ui-refresh=editorOptions.mode>\n" +
    "    </ui-codemirror>\n" +
    "  </div>\n" +
    "</mrt-page-wrapper>\n" +
    "");
  $templateCache.put("views/team/edit.dialog.html",
    "<div class=edit-dialog-container>\n" +
    "  <h2 class=md-title>Editar time</h2>\n" +
    "  <form name=form novalidate>\n" +
    "    <div class=form-group>\n" +
    "      <input placeholder=\"Nome do time\" ng-model=team.name name=name maxlength=50 required>\n" +
    "    </div>\n" +
    "    <div class=form-group>\n" +
    "      <textarea placeholder=\"Lema do time\" ng-model=team.description name=description maxlength=200></textarea>\n" +
    "    </div>\n" +
    "    <br style=\"clear: both\">\n" +
    "    <md-button ng-click=edit() class=md-primary ng-disabled=form.$invalid>Editar</md-button>\n" +
    "    <md-button ng-click=cancel() class=md-primary>Cancelar</md-button>\n" +
    "  </form>\n" +
    "</div>\n" +
    "");
  $templateCache.put("views/team/team.html",
    "<mrt-breadcrumbs location=\"'Codepit / Times'\" title=team.name>\n" +
    "</mrt-breadcrumbs>\n" +
    "\n" +
    "<mrt-page-wrapper wait-while=loading class=team-container>\n" +
    "  <md-menu ng-if=inTeam>\n" +
    "    <md-button class=\"md-icon-button md-raised team-menu-icon\" ng-click=\"openMenu($mdOpenMenu, $event)\">\n" +
    "      <md-icon class=material-icons style=\"color: #888\">menu</md-icon>\n" +
    "    </md-button>\n" +
    "    <md-menu-content width=3>\n" +
    "      <md-menu-item>\n" +
    "        <md-button ng-click=edit($event)>\n" +
    "          <md-icon class=material-icons>mode_edit</md-icon>\n" +
    "          Editar...\n" +
    "        </md-button>\n" +
    "      </md-menu-item>\n" +
    "      <md-menu-divider ng-if=\"team.members.length+team.invites.length<5\"></md-menu-divider>\n" +
    "      <md-menu-item ng-if=\"team.members.length+team.invites.length<5\">\n" +
    "        <md-button ng-click=invite($event)>\n" +
    "          <md-icon class=material-icons>person_add</md-icon>\n" +
    "          Convidar...\n" +
    "        </md-button>\n" +
    "      </md-menu-item>\n" +
    "    </md-menu-content>\n" +
    "  </md-menu>\n" +
    "\n" +
    "  <div layout=column layout-align=\"center center\">\n" +
    "    <div ng-if=team.description style=\"color: #888; max-width: 400px; font-style: italic; word-wrap: break-word\">\n" +
    "      <i class=\"fa fa-quote-left\" aria-hidden=true></i>\n" +
    "      {{team.description}}\n" +
    "      <i class=\"fa fa-quote-right\" aria-hidden=true></i>\n" +
    "    </div>\n" +
    "    <h2 class=md-title>Membros do time</h2>\n" +
    "    <div layout=row layout-xs=column layout-align=\"center center\" layout-wrap>\n" +
    "      <div ng-repeat=\"user in team.members\">\n" +
    "        <md-card ng-class=\"{'logged-user-card': isUser(user._id)}\">\n" +
    "          <span style=\"position: absolute\" ng-if=inTeam>\n" +
    "            <a class=\"user-remove link\" mrt-confirm-click=remove(user._id) mrt-confirm-click-descr=\"Clicar em 'Sim' irá retirar {{user.local.username}} deste time.\">\n" +
    "              <i class=\"fa fa-times-circle\" aria-hidden=true></i>\n" +
    "            </a>\n" +
    "          </span>\n" +
    "          <md-card-title>\n" +
    "            <md-card-title-media>\n" +
    "              <div class=\"md-media-sm card-media\" layout layout-align=\"center center\">\n" +
    "                <div class=profile-image-container>\n" +
    "                  <img class=profile-image ng-src=\"//www.gravatar.com/avatar/{{user.local.emailHash}}?d=identicon&s=150\" style=width:100%>\n" +
    "                </div>\n" +
    "              </div>\n" +
    "            </md-card-title-media>\n" +
    "            <md-card-title-text>\n" +
    "              <span class=md-headline><a class=unrated-handle ui-sref=profile({id:user._id})>{{user.local.username}}</a></span>\n" +
    "              <span class=\"md-subhead description\">{{user.local.fullName}}</span>\n" +
    "            </md-card-title-text>\n" +
    "          </md-card-title>\n" +
    "        </md-card>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <h2 ng-if=\"team.invites.length > 0\" class=md-title>Convidados pendentes</h2>\n" +
    "    <div ng-if=\"team.invites.length > 0\" layout=row layout-xs=column layout-align=\"center center\" layout-wrap>\n" +
    "      <div ng-repeat=\"user in team.invites\">\n" +
    "        <md-card ng-class=\"{'logged-user-card': isUser(user._id)}\">\n" +
    "          <span style=\"position: absolute\" ng-if=inTeam>\n" +
    "            <a class=\"user-remove link\" mrt-confirm-click=remove(user._id) mrt-confirm-click-descr=\"Clicar em 'Sim' irá retirar o convite de {{user.local.username}}.\">\n" +
    "              <i class=\"fa fa-times-circle\" aria-hidden=true></i>\n" +
    "            </a>\n" +
    "          </span>\n" +
    "          <span style=\"position: absolute\" ng-if=isUser(user._id)>\n" +
    "            <a class=\"user-join link\" ng-click=accept(user)>\n" +
    "              <i class=\"fa fa-arrow-circle-up\" aria-hidden=true></i>\n" +
    "            </a>\n" +
    "            <a class=\"user-remove link\" ng-click=decline(user)>\n" +
    "              <i class=\"fa fa-times-circle\" aria-hidden=true></i>\n" +
    "            </a>\n" +
    "          </span>\n" +
    "          <md-card-title>\n" +
    "            <md-card-title-media>\n" +
    "              <div class=\"md-media-sm card-media\" layout layout-align=\"center center\">\n" +
    "                <div class=profile-image-container>\n" +
    "                  <img class=profile-image ng-src=\"//www.gravatar.com/avatar/{{user.local.emailHash}}?d=identicon&s=150\" style=width:100%>\n" +
    "                </div>\n" +
    "              </div>\n" +
    "            </md-card-title-media>\n" +
    "            <md-card-title-text>\n" +
    "              <span class=md-headline><a class=unrated-handle ui-sref=profile({id:user._id})>{{user.local.username}}</a></span>\n" +
    "              <span class=\"md-subhead description\">{{user.local.fullName}}</span>\n" +
    "            </md-card-title-text>\n" +
    "          </md-card-title>\n" +
    "        </md-card>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</mrt-page-wrapper>\n" +
    "");
  $templateCache.put("views/user/login-form.html",
    "<div id=user-nav class=\"nav navbar-nav navbar-right\">\n" +
    "  <div ng-show=!loading>\n" +
    "    <div ng-hide=$root.user.isAuthenticated()>\n" +
    "      <form ng-submit=login()>\n" +
    "        <md-input-container class=\"form-group md-default-theme\" flex>\n" +
    "          <label class=control-label>Email</label>\n" +
    "          <input class=user-email type=email name=email ng-model=data.email class=\"form-control md-default-theme\">\n" +
    "        </md-input-container>\n" +
    "\n" +
    "        <md-input-container class=\"form-group md-default-theme\" flex>\n" +
    "          <label class=control-label>Senha</label>\n" +
    "          <input class=user-password type=password ng-model=data.password class=\"form-control md-default-theme\">\n" +
    "          <div style=\"position: absolute; left: 3px; bottom: -14px; color: #aaa; font-size: 10px\">\n" +
    "            <span class=link ng-click=openForgotPasswordDialog($event)>Esqueceu a senha?</span>\n" +
    "          </div>\n" +
    "        </md-input-container>\n" +
    "\n" +
    "\n" +
    "        <div class=form-group>\n" +
    "          <button class=user-submit type=submit class=\"btn btn-default\">\n" +
    "            <i class=\"fa fa-arrow-right\"></i>\n" +
    "          </button>\n" +
    "        </div>\n" +
    "      </form>\n" +
    "\n" +
    "      <a class=\"btn btn-icon user-register\" ui-sref=register>\n" +
    "        <span>\n" +
    "          <i class=\"fa fa-user\"></i>\n" +
    "        </span>\n" +
    "        Registre-se\n" +
    "      </a>\n" +
    "    </div>\n" +
    "    <div ng-show=$root.user.isAuthenticated()>\n" +
    "      <a class=\"btn btn-icon user-logout\" ng-click=logout()>\n" +
    "        <span>\n" +
    "          <i class=\"fa fa-user\"></i>\n" +
    "        </span>\n" +
    "        Sair\n" +
    "      </a>\n" +
    "      <a class=profile-link ui-sref=profile({id:$root.user.getId()})>\n" +
    "        <img ng-src=\"//www.gravatar.com/avatar/{{$root.user.getEmailHash()}}?d=identicon&s=50\">\n" +
    "        Perfil\n" +
    "      </a>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div ng-show=loading layout=column layout-align=\"center center\">\n" +
    "    <md-progress-circular md-mode=indeterminate md-diameter=70></md-progress-circular>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
  $templateCache.put("views/user/profile.data.html",
    "<md-content layout-padding layout=row layout-xs=column>\n" +
    "  <div flex-gt-xs=30 flex-xs=grow layout=column layout-align=\"start center\">\n" +
    "    <div class=profile-image-container>\n" +
    "      <a href=//br.gravatar.com/ target=_blank><img class=profile-image ng-src=\"//www.gravatar.com/avatar/{{UserState.user.local.emailHash}}?d=identicon&s=250\" style=width:100%></a>\n" +
    "    </div>\n" +
    "    <div class=unrated-handle>{{UserState.user.local.username}}</div>\n" +
    "    <div class=unrated-label>unrated</div>\n" +
    "  </div>\n" +
    "  <div flex-gt-xs=60 flex-xs=grow id=form-container>\n" +
    "    <form name=form novalidate>\n" +
    "      <div class=\"form-group input-split\">\n" +
    "        <input placeholder=Nome ng-model=UserState.user.local.name name=name maxlength=100 required>\n" +
    "        <input placeholder=Sobrenome ng-model=UserState.user.local.surname name=surname maxlength=100 required>\n" +
    "        <br style=\"clear: both\">\n" +
    "        <small class=error ng-show=\"form.name | mrtHasError\">* você deve inserir um nome</small>\n" +
    "        <small class=error ng-show=\"form.surname | mrtHasError\">* você deve inserir um sobrenome</small>\n" +
    "      </div>\n" +
    "      <div class=form-group>\n" +
    "        <input type=email placeholder=Email ng-model=UserState.user.local.email name=email disabled>\n" +
    "      </div>\n" +
    "      <br style=\"clear: both\">\n" +
    "      <div class=form-group>\n" +
    "        <button type=submit class=\"btn btn-block\" ng-click=register() class=\"btn btn-default btn-block\" ng-disabled=form.$invalid>Enviar</button>\n" +
    "      </div>\n" +
    "    </form>\n" +
    "  </div>\n" +
    "  <div flex=20></div>\n" +
    "</md-content>\n" +
    "");
  $templateCache.put("views/user/profile.html",
    "<mrt-breadcrumbs location=\"'Codepit / Usuários'\" title=usernameTitle>\n" +
    "</mrt-breadcrumbs>\n" +
    "\n" +
    "<mrt-page-wrapper wait-for=!loadingData>\n" +
    "  <div ng-cloak id=profile-container>\n" +
    "    <div ng-if=\"id === UserState.getId() && UserState.isNotVerified()\">\n" +
    "      <div class=\"alert alert-warning\" role=alert>\n" +
    "        <button type=button class=close data-dismiss=alert aria-label=Close><span aria-hidden=true>&times;</span></button>\n" +
    "        <strong>Sua conta ainda não foi verificada</strong>, o que limita suas ações no Codepit. Caso não tenha recebido o e-mail de verificação, <a href=\"\" ng-click=sendValidationEmail()>clique aqui</a> para enviarmos novamente.\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <md-content ng-if=\"id === $root.user.getId()\">\n" +
    "      <md-tabs md-dynamic-height md-border-bottom>\n" +
    "        <md-tab ui-sref=. label=perfil md-active=\"state.current.name === 'profile'\"></md-tab>\n" +
    "        <md-tab ui-sref=.teams label=times md-active=\"state.current.name === 'profile.teams'\"></md-tab>\n" +
    "        <md-tab ng-if=$root.user.isAdmin() ui-sref=.posts label=posts md-active=\"state.current.name === 'profile.posts'\"></md-tab>\n" +
    "      </md-tabs>\n" +
    "      <ui-view>\n" +
    "        <ng-include src=\"'views/user/profile.data.html'\"></ng-include>\n" +
    "      </ui-view>\n" +
    "    </md-content>\n" +
    "    <div ng-if=\"id !== $root.user.getId()\">\n" +
    "      <ng-include src=\"'views/user/profile.user.html'\"></ng-include>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</mrt-page-wrapper>\n" +
    "");
  $templateCache.put("views/user/profile.posts.dialog.html",
    "<md-dialog aria-label=\"New Post\">\n" +
    "  <form>\n" +
    "    <md-toolbar class=md-accent>\n" +
    "      <md-input-container class=md-toolbar-tools>\n" +
    "        <label>Título</label>\n" +
    "        <input ng-model=post.title>\n" +
    "      </md-input-container>\n" +
    "    </md-toolbar>\n" +
    "    <md-dialog-content style=padding:20px>\n" +
    "      <text-angular ng-model=post.body></text-angular>\n" +
    "    </md-dialog-content>\n" +
    "    <md-dialog-actions layout=row>\n" +
    "      <md-button ng-if=!create class=\"md-raised md-warn\">\n" +
    "        Deletar\n" +
    "      </md-button>\n" +
    "      <span flex></span>\n" +
    "      <md-button ng-click=cancel()>\n" +
    "        Cancelar\n" +
    "      </md-button>\n" +
    "      <md-button ng-click=submit() style=margin-right:20px class=\"md-raised md-accent\">\n" +
    "        <span ng-if=create>Postar</span>\n" +
    "        <span ng-if=!create>Editar</span>\n" +
    "      </md-button>\n" +
    "    </md-dialog-actions>\n" +
    "  </form>\n" +
    "</md-dialog>\n" +
    "");
  $templateCache.put("views/user/profile.posts.html",
    "<md-button class=\"md-fab md-mini md-hue-2\" ng-click=newPost()>\n" +
    "  <i class=\"fa fa-pencil\" aria-hidden=true></i>\n" +
    "</md-button>\n" +
    "<mrt-blog-posts user=id></mrt-blog-posts>\n" +
    "");
  $templateCache.put("views/user/profile.teams.html",
    "<mrt-page-wrapper wait-while=loading class=team-container>\n" +
    "  <md-button style=\"float: right\" ng-click=newTeam($event) class=md-primary ng-if=\"member.length < 20\">\n" +
    "    <md-icon class=material-icons>add</md-icon>Criar Time\n" +
    "  </md-button>\n" +
    "  <div layout=row ng-if=\"member.length === 0\">\n" +
    "    <p style=\"color: #777\">\n" +
    "      Você não está em nenhum time.\n" +
    "    </p>\n" +
    "  </div>\n" +
    "  <div layout=row ng-if=\"member.length > 0\" layout-wrap>\n" +
    "    <md-list-item flex=30 class=md-3-line ng-repeat=\"team in member\" ui-sref=team({id:team._id}) style=\"margin-top: 10px\">\n" +
    "      <div class=\"md-list-item-text team-card\" layout=column>\n" +
    "        <h3><b>{{ team.name }}</b></h3>\n" +
    "        <p ng-repeat=\"user in team.members\">\n" +
    "          <span><img class=profile-image ng-src=\"//www.gravatar.com/avatar/{{user.local.emailHash}}?d=identicon&s=20\">&nbsp;{{ user.local.username }}</span>\n" +
    "        </p>\n" +
    "      </div>\n" +
    "    </md-list-item>\n" +
    "  </div>\n" +
    "  <div ng-if=\"invited.length > 0\" style=\"margin-top: 20px\">\n" +
    "    <md-subheader>Convites pendentes ({{invited.length}})</md-subheader>\n" +
    "    <div layout=row layout-wrap>\n" +
    "      <md-list-item flex=30 class=md-3-line ng-repeat=\"team in invited\" ui-sref=team({id:team._id}) style=\"margin-top: 10px\">\n" +
    "        <div class=\"md-list-item-text team-card\" layout=column>\n" +
    "          <h3><b>{{ team.name }}</b></h3>\n" +
    "          <p ng-repeat=\"user in team.members\">\n" +
    "            <span><img class=profile-image ng-src=\"//www.gravatar.com/avatar/{{user.local.emailHash}}?d=identicon&s=20\">&nbsp;{{ user.local.username }}</span>\n" +
    "          </p>\n" +
    "        </div>\n" +
    "      </md-list-item>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</mrt-page-wrapper>\n" +
    "");
  $templateCache.put("views/user/profile.user.html",
    "<div layout=row layout-align=\"start center\">\n" +
    "  <div flex-gt-xs=30 flex-xs=grow layout=column layout-align=\"start center\">\n" +
    "    <div class=profile-image-container>\n" +
    "      <a href=//br.gravatar.com/ target=_blank><img class=profile-image ng-src=\"//www.gravatar.com/avatar/{{user.emailHash}}?d=identicon&s=200\" style=width:100%></a>\n" +
    "    </div>\n" +
    "    <div class=unrated-handle>{{user.username}}</div>\n" +
    "    <div class=unrated-label>unrated</div>\n" +
    "  </div>\n" +
    "  <div><b>Nome</b>: {{user.fullName}}</div>\n" +
    "</div>\n" +
    "\n" +
    "");
  $templateCache.put("views/user/recover.html",
    "<mrt-breadcrumbs location=\"'Codepit / Usuários'\" title=\"'Recuperação de Senha'\">\n" +
    "</mrt-breadcrumbs>\n" +
    "\n" +
    "<mrt-page-wrapper>\n" +
    "  <div class=row id=form-container>\n" +
    "    <div class=\"col-md-6 col-md-offset-3\">\n" +
    "      <form name=form novalidate>\n" +
    "        <div class=form-group>\n" +
    "          <input type=hidden placeholder=\"Token de validação\" ng-model=user.hash name=hash required>\n" +
    "          <small class=error ng-show=\"form.hash | mrtHasError\">* o token de validação é obrigatório</small>\n" +
    "        </div>\n" +
    "        <div class=\"form-group input-split\">\n" +
    "          <input type=password name=password placeholder=\"Nova senha\" ng-model=user.password maxlength=100 required>\n" +
    "          <input type=password name=confirmPassword placeholder=\"Repita a nova senha\" ng-model=user.confirmPassword name=confirmPass mrt-match-field={{user.password}} maxlength=100 required>\n" +
    "          <br style=\"clear: both\">\n" +
    "          <small class=error ng-show=\"form.password | mrtHasError\">* você deve inserir uma senha.</small>\n" +
    "          <small class=error ng-show=\"form.confirmPassword | mrtHasError\">* você deve confirmar a senha corretamente.</small>\n" +
    "        </div>\n" +
    "        <div vc-recaptcha ng-model=user.recaptcha style=\"margin: 0 auto; width: 304px\"></div>\n" +
    "        <br style=\"clear: both\">\n" +
    "        <div class=form-group>\n" +
    "          <button type=submit class=\"btn btn-block\" ng-click=recover() class=\"btn btn-default btn-block\" ng-disabled=form.$invalid>Mudar senha</button>\n" +
    "        </div>\n" +
    "      </form>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</mrt-page-wrapper>\n" +
    "");
  $templateCache.put("views/user/register.html",
    "<mrt-breadcrumbs location=\"'Codepit / Home'\" title=\"'Registre-se'\">\n" +
    "</mrt-breadcrumbs>\n" +
    "\n" +
    "<mrt-page-wrapper wait-while=loading>\n" +
    "  <div class=row id=form-container>\n" +
    "    <div class=\"col-md-6 col-md-offset-3\">\n" +
    "      <h3>Registre-se no <strong>Codepit</strong> e comece a criar e competir em competições de programação. </h3>\n" +
    "      <form name=form novalidate>\n" +
    "        <div class=\"form-group input-split\">\n" +
    "          <input placeholder=Nome ng-model=user.name name=name maxlength=100 required>\n" +
    "          <input placeholder=Sobrenome ng-model=user.surname name=surname maxlength=100 required>\n" +
    "          <br style=\"clear: both\">\n" +
    "          <small class=error ng-show=\"form.name | mrtHasError\">* você deve inserir um nome</small>\n" +
    "          <small class=error ng-show=\"form.surname | mrtHasError\">* você deve inserir um sobrenome</small>\n" +
    "        </div>\n" +
    "        <div class=form-group>\n" +
    "          <input placeholder=\"Nome de usuário\" ng-model=user.username name=username maxlength=30 mrt-unique-username required uib-tooltip=\"Este nome será seu handle oficial nas competições e não poderá ser modificado.\">\n" +
    "          <small class=error ng-show=\"form.username | mrtHasError\">* nome de usuário inválido ou já cadastrado</small>\n" +
    "        </div>\n" +
    "        <div class=form-group>\n" +
    "          <input type=email placeholder=Email ng-model=user.email name=email mrt-unique-email maxlength=100 required>\n" +
    "          <small class=error ng-show=\"form.email | mrtHasError\">* e-mail inválido ou já cadastrado</small>\n" +
    "        </div>\n" +
    "        <div class=\"form-group input-split\">\n" +
    "          <input type=password name=password placeholder=Senha ng-model=user.password maxlength=100 required>\n" +
    "          <input type=password name=confirmPassword placeholder=\"Repita a senha\" ng-model=user.confirmPassword name=confirmPass mrt-match-field={{user.password}} maxlength=100 required>\n" +
    "          <br style=\"clear: both\">\n" +
    "          <small class=error ng-show=\"form.password | mrtHasError\">* você deve inserir uma senha.</small>\n" +
    "          <small class=error ng-show=\"form.confirmPassword | mrtHasError\">* você deve confirmar a senha corretamente.</small>\n" +
    "        </div>\n" +
    "        \n" +
    "        <div vc-recaptcha ng-model=user.recaptcha style=\"margin: 0 auto; width: 304px\"></div>\n" +
    "        <br style=\"clear: both\">\n" +
    "        <div class=form-group>\n" +
    "          <button type=submit class=\"btn btn-block\" ng-click=register() class=\"btn btn-default btn-block\" ng-disabled=form.$invalid>Enviar</button>\n" +
    "        </div>\n" +
    "      </form>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</mrt-page-wrapper>\n" +
    "");
  $templateCache.put("views/user/validate.html",
    "<mrt-breadcrumbs location=\"'Codepit / Usuários'\" title=\"'Validando E-mail...'\">\n" +
    "</mrt-breadcrumbs>\n" +
    "\n" +
    "<mrt-page-wrapper wait-while=validating></mrt-page-wrapper>\n" +
    "");
}]);
