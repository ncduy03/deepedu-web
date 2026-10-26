import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Navigate, NavLink, useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { ConfirmDialog, FormDialog, KeyRevealDialog, UpgradeDialog } from './ProjectDialogs.jsx';
import { Pagination, StatusBadge } from './ProjectsPage.jsx';
import { formatCount, PICON } from './projectsData.js';
import { isValidEmail } from '../../state/SignupContext.jsx';
import './Projects.css';

const PAGE_SIZE = 10;

function IconAction({ icon, label, onClick, disabled, greyed }) {
  return (
    <button
      type="button"
      className={`pj-icon-action${greyed ? ' is-greyed' : ''}`}
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
    >
      <img src={PICON(icon)} alt="" width="18" height="18" />
    </button>
  );
}

function HeaderButton({ icon, children, danger, onClick }) {
  return (
    <button
      type="button"
      className={`ui-btn ui-btn--tertiary pj-btn--sm pj-header-btn${danger ? ' pj-btn--outline-danger' : ''}`}
      onClick={onClick}
      title={children}
      aria-label={children}
    >
      <img src={PICON(icon)} alt="" width="20" height="20" />
      <span className="pj-header-btn__label">{children}</span>
    </button>
  );
}

function usePaged(rows) {
  const [page, setPage] = useState(1);
  const pages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  // Deleting the last row of the last page moves back one page.
  useEffect(() => {
    if (page > pages) setPage(pages);
  }, [page, pages]);
  return { page, setPage, visible: rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE) };
}

function KeysTab({ project, paused, onAction }) {
  const { page, setPage, visible } = usePaged(project.keys);
  return (
    <>
      <div className="pj-list-head">
        <h2>Danh sách API Key ({project.keys.length})</h2>
        <button type="button" className="ui-btn ui-btn--primary pj-btn--sm" onClick={() => onAction('newKey')}>
          <img src={PICON('ic-plus-20')} alt="" width="20" height="20" />
          Tạo API key
        </button>
      </div>

      <div className="pj-table-scroll">
        <table className="pj-table pj-table--keys">
          <thead>
            <tr>
              <th>Tên API Key</th>
              <th className="col-requests is-end">Tổng requests</th>
              <th className="col-num is-end">Tổng tokens</th>
              <th className="col-num is-end">Tổng credits</th>
              <th className="col-status">Trạng thái</th>
              <th className="col-actions is-end">Tác vụ</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((k) => {
              const active = k.active && !paused;
              return (
                <tr key={k.id}>
                  <td>
                    <div className="pj-cell-text">
                      <span className="pj-cell-text__main">{k.name}</span>
                      <span className="pj-cell-text__sub">
                        Tạo ngày: {k.created} • Dùng gần nhất: {k.lastUsed || 'Chưa sử dụng'}
                      </span>
                    </div>
                  </td>
                  <td className="is-end">{k.requests.toLocaleString('vi-VN')}</td>
                  <td className="is-end">{formatCount(k.tokens)}</td>
                  <td className="is-end pj-table__credits">{k.credits.toLocaleString('vi-VN')}</td>
                  <td>
                    <StatusBadge active={active} label={active ? 'Hoạt động' : 'Vô hiệu hóa'} />
                  </td>
                  <td className="is-end">
                    <div className="pj-actions">
                      <IconAction icon="ic-pencil-18" label="Đổi tên" onClick={() => onAction('renameKey', k)} />
                      <IconAction
                        icon={active ? 'ic-toggle-right' : 'ic-toggle-left'}
                        label={active ? 'Vô hiệu hóa' : 'Kích hoạt lại'}
                        disabled={paused}
                        onClick={() => onAction(k.active ? 'disableKey' : 'enableKey', k)}
                      />
                      <IconAction
                        icon={active ? 'ic-refresh' : 'ic-refresh-disabled'}
                        label="Tạo lại"
                        disabled={!active}
                        greyed
                        onClick={() => onAction('regenKey', k)}
                      />
                      <IconAction icon="ic-trash-18" label="Xóa" onClick={() => onAction('deleteKey', k)} />
                    </div>
                  </td>
                </tr>
              );
            })}
            {!visible.length && (
              <tr>
                <td colSpan={6} className="pj-table__empty">
                  Dự án chưa có API Key nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination total={project.keys.length} page={page} pageSize={PAGE_SIZE} onPage={setPage} />
    </>
  );
}

function MembersTab({ project, ownerEmail, isOrg, onAction }) {
  const { page, setPage, visible } = usePaged(project.members);
  return (
    <>
      <div className="pj-list-head">
        <h2>Danh sách thành viên dự án ({project.members.length})</h2>
        <button type="button" className="ui-btn ui-btn--primary pj-btn--sm" onClick={() => onAction(isOrg ? 'addMember' : 'upgrade')}>
          <img src={PICON('ic-plus-20')} alt="" width="20" height="20" />
          Thêm thành viên
        </button>
      </div>

      <div className="pj-table-scroll">
        <table className="pj-table pj-table--members">
          <thead>
            <tr>
              <th>Thành viên</th>
              <th className="col-role">Vai trò</th>
              <th className="col-joined">Ngày tham gia</th>
              <th className="col-status">Trạng thái</th>
              <th className="col-actions is-end">Tác vụ</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((m) => {
              const self = m.email === ownerEmail;
              return (
                <tr key={m.email}>
                  <td>
                    <div className="pj-person">
                      <span className="pj-person__avatar">{m.name.trim()[0]?.toUpperCase()}</span>
                      <div className="pj-cell-text">
                        <span className="pj-cell-text__main">{m.name}</span>
                        <span className="pj-cell-text__sub">{m.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    {m.role === 'admin' ? (
                      <span className="pj-role is-admin">
                        <img src={PICON('ic-shield-14')} alt="" width="14" height="14" />
                        Quản trị viên
                      </span>
                    ) : (
                      <span className="pj-role">
                        <img src={PICON('ic-user-14')} alt="" width="14" height="14" />
                        Thành viên
                      </span>
                    )}
                  </td>
                  <td>{m.joined}</td>
                  <td>
                    <StatusBadge active={m.active} label={m.active ? 'Hoạt động' : 'Vô hiệu hoá'} />
                  </td>
                  <td className="is-end">
                    <div className="pj-actions">
                      <IconAction
                        icon={m.active ? 'ic-toggle-right' : 'ic-toggle-left'}
                        label={self ? 'Bạn không thể tự vô hiệu hóa' : m.active ? 'Vô hiệu hóa' : 'Kích hoạt lại'}
                        disabled={self}
                        onClick={() => onAction(m.active ? 'disableMember' : 'enableMember', m)}
                      />
                      <IconAction
                        icon="ic-trash-18"
                        label={self ? 'Bạn không thể tự xóa mình khỏi dự án' : 'Xóa khỏi dự án'}
                        disabled={self}
                        onClick={() => onAction('deleteMember', m)}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Pagination total={project.members.length} page={page} pageSize={PAGE_SIZE} onPage={setPage} />
    </>
  );
}

/** "Chi tiết dự án" — project info, header actions, and the API Key / Thành viên dự án (organizations only) tabs. */
export default function ProjectDetailPage({ tab = 'keys' }) {
  const { projectId } = useParams();
  const { projects, headerActions, user, account } = useOutletContext();
  const navigate = useNavigate();
  const [dialog, setDialog] = useState(null); // { type, item }
  const project = projects.get(projectId);

  const isOrg = account?.type === 'org';

  if (!project) return <Navigate to="/tai-khoan/du-an" replace />;
  // Personal accounts have no project members: the members tab redirects to API Key.
  if (!isOrg && tab === 'members') return <Navigate to={`/tai-khoan/du-an/${project.id}`} replace />;

  const paused = project.status === 'paused';
  const base = `/tai-khoan/du-an/${project.id}`;
  const open = (type, item) => setDialog({ type, item });
  const close = () => setDialog(null);
  const item = dialog?.item;

  const renderDialog = () => {
    switch (dialog?.type) {
      case 'rename':
        return (
          <FormDialog
            title="Sửa tên dự án"
            label="Tên dự án"
            initial={project.name}
            placeholder="VD: Trợ lý Luyện Viết Tiếng Anh IELTS"
            confirmLabel="Lưu thay đổi"
            onClose={close}
            onSubmit={(name) => {
              projects.rename(project.id, name);
              close();
            }}
          />
        );
      case 'pause':
        return (
          <ConfirmDialog
            title="Xác nhận tạm dừng dự án"
            tone="warning"
            confirmLabel="Tạm dừng"
            cancelLabel="Hủy"
            onClose={close}
            onConfirm={() => {
              projects.setStatus(project.id, 'paused');
              close();
            }}
          >
            <p>Bạn có chắc chắn muốn tạm dừng dự án này? Các API Key thuộc dự án này sẽ bị vô hiệu hóa.</p>
          </ConfirmDialog>
        );
      case 'resume':
        return (
          <ConfirmDialog
            title="Kích hoạt lại dự án?"
            confirmLabel="Kích hoạt"
            onClose={close}
            onConfirm={() => {
              projects.setStatus(project.id, 'active');
              close();
            }}
          >
            <p>
              Dự án <strong>{project.name}</strong> sẽ hoạt động trở lại và các API Key đang bật có thể tiếp tục nhận yêu cầu
              gọi API.
            </p>
          </ConfirmDialog>
        );
      case 'delete':
        return (
          <ConfirmDialog
            title="Xác nhận xóa dự án"
            tone="danger"
            confirmLabel="Xóa dự án"
            cancelLabel="Hủy"
            onClose={close}
            onConfirm={() => {
              navigate('/tai-khoan/du-an', { replace: true });
              projects.remove(project.id);
            }}
          >
            <p>Bạn có chắc chắn muốn xoá dự án này?</p>
            <p>
              API key thuộc dự án sẽ bị thu hồi.
              {isOrg && ' Thành viên chỉ bị gỡ khỏi dự án, không bị xóa khỏi tổ chức.'}
            </p>
            <p>Hành động này không thể hoàn tác.</p>
          </ConfirmDialog>
        );
      case 'newKey':
        return (
          <FormDialog
            title="Tạo API Key mới"
            subtitle={`Dự án: ${project.name}`}
            label="Tên API Key"
            placeholder="Nhập tên API Key"
            confirmLabel="Khởi tạo & Nhận Key"
            onClose={close}
            onSubmit={(name) => setDialog({ type: 'reveal', item: { name, secret: projects.addKey(project.id, name) } })}
          />
        );
      case 'renameKey':
        return (
          <FormDialog
            title="Đổi tên API Key"
            label="Tên API Key"
            redMark
            initial={item.name}
            confirmLabel="Lưu thông tin"
            cancelLabel="Hủy"
            divider
            onClose={close}
            onSubmit={(name) => {
              projects.renameKey(project.id, item.id, name);
              close();
            }}
          />
        );
      case 'disableKey':
        return (
          <ConfirmDialog
            title="Vô hiệu hóa API Key?"
            subtitle={item.name}
            tone="warning"
            confirmLabel="Vô hiệu hóa"
            onClose={close}
            onConfirm={() => {
              projects.setKeyActive(project.id, item.id, false);
              close();
            }}
          >
            <p>
              Khóa <strong>{item.name}</strong> sẽ tạm thời bị vô hiệu hóa. Các yêu cầu gọi API từ ứng dụng sử dụng khóa này
              sẽ bị từ chối cho đến khi được kích hoạt lại.
            </p>
          </ConfirmDialog>
        );
      case 'enableKey':
        return (
          <ConfirmDialog
            title="Kích hoạt lại API Key?"
            subtitle={item.name}
            confirmLabel="Kích hoạt"
            onClose={close}
            onConfirm={() => {
              projects.setKeyActive(project.id, item.id, true);
              close();
            }}
          >
            <p>
              Khóa <strong>{item.name}</strong> sẽ được kích hoạt lại và có thể tiếp tục nhận các yêu cầu gọi API bình
              thường.
            </p>
          </ConfirmDialog>
        );
      case 'regenKey':
        return (
          <ConfirmDialog
            title="Tạo lại API Key"
            subtitle={item.name}
            confirmLabel="Xác nhận tạo lại"
            alert={
              <>
                Giá trị API Key mới sẽ chỉ được hiển thị <strong>một lần duy nhất</strong> ngay sau khi xác nhận.
              </>
            }
            onClose={close}
            onConfirm={() => setDialog({ type: 'reveal', item: { name: item.name, secret: projects.regenerateKey() } })}
          >
            <p>
              Bạn có chắc chắn muốn tạo lại API Key <strong>&quot;{item.name}&quot;</strong>? Hệ thống sẽ tạo một API Key mới
              để thay thế và lập tức vô hiệu hóa API Key cũ.
            </p>
          </ConfirmDialog>
        );
      case 'deleteKey':
        return (
          <ConfirmDialog
            title="Xóa API Key"
            subtitle={item.name}
            tone="danger"
            confirmLabel="Xác nhận xóa"
            onClose={close}
            onConfirm={() => {
              projects.removeKey(project.id, item.id);
              close();
            }}
          >
            <p>
              Bạn có chắc chắn muốn xóa vĩnh viễn API Key <strong>&quot;{item.name}&quot;</strong>?
            </p>
            <p>
              Mọi yêu cầu gọi API sử dụng khóa này sẽ bị từ chối ngay lập tức. Sau khi thu hồi, bạn vẫn có thể tạo thêm các
              API Key mới bất cứ lúc nào.
            </p>
          </ConfirmDialog>
        );
      case 'reveal':
        return <KeyRevealDialog keyName={item.name} secret={item.secret} onClose={close} />;
      case 'disableMember':
        return (
          <ConfirmDialog
            title="Vô hiệu hóa thành viên?"
            tone="warning"
            confirmLabel="Vô hiệu hóa"
            onClose={close}
            onConfirm={() => {
              projects.setMemberActive(project.id, item.email, false);
              close();
            }}
          >
            <p>
              Bạn có chắc chắn muốn vô hiệu hóa thành viên <strong>{item.name}</strong> ({item.email})? Người này sẽ tạm
              thời bị mất quyền truy cập tài nguyên của dự án.
            </p>
          </ConfirmDialog>
        );
      case 'enableMember':
        return (
          <ConfirmDialog
            title="Kích hoạt lại thành viên?"
            confirmLabel="Kích hoạt"
            onClose={close}
            onConfirm={() => {
              projects.setMemberActive(project.id, item.email, true);
              close();
            }}
          >
            <p>
              Bạn có chắc chắn muốn kích hoạt lại quyền của <strong>{item.name}</strong>?
            </p>
          </ConfirmDialog>
        );
      case 'deleteMember':
        return (
          <ConfirmDialog
            title="Xác nhận xóa thành viên?"
            tone="danger"
            confirmLabel="Xác nhận xóa"
            onClose={close}
            onConfirm={() => {
              projects.removeMember(project.id, item.email);
              close();
            }}
          >
            <p>
              Bạn có chắc chắn muốn xóa thành viên <strong>{item.name}</strong> ({item.email}) khỏi dự án này? Thao tác
              này không thể hoàn tác.
            </p>
          </ConfirmDialog>
        );
      case 'addMember':
        return (
          <FormDialog
            title="Thêm thành viên"
            subtitle={`Dự án: ${project.name}`}
            label="Email thành viên"
            placeholder="name@company.com"
            confirmLabel="Thêm thành viên"
            validate={(email) =>
              !isValidEmail(email)
                ? 'Vui lòng nhập địa chỉ email hợp lệ.'
                : project.members.some((m) => m.email === email.toLowerCase())
                  ? 'Thành viên này đã có trong dự án.'
                  : ''
            }
            onClose={close}
            onSubmit={(email) => {
              projects.addMember(project.id, email.toLowerCase());
              close();
            }}
          />
        );
      case 'upgrade':
        return <UpgradeDialog onClose={close} onUpgrade={() => navigate('/dang-ky/to-chuc')} />;
      default:
        return null;
    }
  };

  return (
    <div className="pj-page pj-page--detail">
      {headerActions &&
        createPortal(
          <>
            {paused ? (
              <HeaderButton icon="ic-toggle-right" onClick={() => open('resume')}>
                Kích hoạt lại
              </HeaderButton>
            ) : (
              <HeaderButton icon="ic-pause-20" onClick={() => open('pause')}>
                Tạm dừng
              </HeaderButton>
            )}
            <HeaderButton icon="ic-pencil-20" onClick={() => open('rename')}>
              Sửa thông tin
            </HeaderButton>
            <HeaderButton icon="ic-trash-20-red" danger onClick={() => open('delete')}>
              Xóa
            </HeaderButton>
          </>,
          headerActions,
        )}

      <section className="pj-info">
        <div className="pj-info__title">
          <h2>{project.name}</h2>
          <span className="pj-info__id">ID: {project.id}</span>
          <StatusBadge active={!paused} label={paused ? 'Tạm dừng' : 'Đang hoạt động'} />
        </div>
        <div className="pj-info__meta">
          <span>
            <img src={PICON('ic-calendar-14')} alt="" width="14" height="14" />
            Ngày tạo: {project.created}
          </span>
          {isOrg && (
            <span>
              <img src={PICON('ic-users-14')} alt="" width="14" height="14" />
              Thành viên: {project.members.length}
            </span>
          )}
          <span>
            <img src={PICON('ic-key-14')} alt="" width="14" height="14" />
            API Key: {project.keys.length}
          </span>
        </div>
      </section>

      <nav className="pj-tabs" aria-label="Chi tiết dự án">
        <NavLink to={base} end className={({ isActive }) => `pj-tabs__item${isActive ? ' is-active' : ''}`}>
          API Key <span className="pj-tabs__count">{project.keys.length}</span>
        </NavLink>
        {isOrg && (
          <NavLink to={`${base}/thanh-vien`} className={({ isActive }) => `pj-tabs__item${isActive ? ' is-active' : ''}`}>
            Thành viên dự án <span className="pj-tabs__count">{project.members.length}</span>
          </NavLink>
        )}
      </nav>

      {tab === 'keys' ? (
        <KeysTab project={project} paused={paused} onAction={open} />
      ) : (
        <MembersTab project={project} ownerEmail={user.email} isOrg={isOrg} onAction={open} />
      )}

      {renderDialog()}
    </div>
  );
}
