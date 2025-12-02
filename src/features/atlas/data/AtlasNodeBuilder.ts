/**
 * Atlas Node Builder
 *
 * Builder パターンを使用して、AtlasNodeData の生成を簡単かつ
 * 読みやすくするためのユーティリティクラス。
 */

import { AtlasNodeData, AtlasNodeType, AtlasDataType } from '../types';
import { Coordinate } from '../utils/CoordinateSystem';

/**
 * Atlas Node Builder クラス
 *
 * @example
 * const node = new AtlasNodeBuilder('pitch-0')
 *   .type('foundation')
 *   .dataType('pitch')
 *   .label('C')
 *   .position(2500, 1500)
 *   .parent('concept-pitch')
 *   .data(pitchClassC)
 *   .tags(['pitch', 'C'])
 *   .build();
 */
export class AtlasNodeBuilder {
  private node: Partial<AtlasNodeData>;

  /**
   * コンストラクタ
   *
   * @param id ノードID
   */
  constructor(id: string) {
    this.node = {
      id,
      tags: [],
    };
  }

  /**
   * ノードタイプを設定
   */
  nodeType(type: AtlasNodeType): this {
    this.node.type = type;
    return this;
  }

  /**
   * データタイプを設定
   */
  dataType(dataType: AtlasDataType): this {
    this.node.dataType = dataType;
    return this;
  }

  /**
   * ラベルを設定
   */
  label(label: string): this {
    this.node.label = label;
    return this;
  }

  /**
   * 座標を設定
   */
  position(x: number, y: number): this {
    this.node.x = x;
    this.node.y = y;
    return this;
  }

  /**
   * 座標オブジェクトを設定
   */
  coordinate(coord: Coordinate): this {
    this.node.x = coord.x;
    this.node.y = coord.y;
    return this;
  }

  /**
   * 親ノードIDを設定
   */
  parent(parentId: string): this {
    this.node.parentId = parentId;
    return this;
  }

  /**
   * ドメインデータを設定
   */
  data(data: unknown): this {
    this.node.data = data;
    return this;
  }

  /**
   * タグを設定
   */
  tags(tags: string[]): this {
    this.node.tags = tags;
    return this;
  }

  /**
   * タグを追加
   */
  addTag(tag: string): this {
    if (!this.node.tags) {
      this.node.tags = [];
    }
    this.node.tags.push(tag);
    return this;
  }

  /**
   * 表示フラグを設定
   */
  visible(visible: boolean): this {
    this.node.visible = visible;
    return this;
  }

  /**
   * ノードを非表示に設定（instance ノードのデフォルト）
   */
  hidden(): this {
    this.node.visible = false;
    return this;
  }

  /**
   * ビルドして AtlasNodeData を返す
   *
   * @throws 必須フィールドが設定されていない場合
   */
  build(): AtlasNodeData {
    const { id, type, dataType, label, x, y, data, tags } = this.node;

    // 必須フィールドのバリデーション
    if (!id) throw new Error('AtlasNodeBuilder: id is required');
    if (!type) throw new Error('AtlasNodeBuilder: type is required');
    if (!dataType) throw new Error('AtlasNodeBuilder: dataType is required');
    if (!label) throw new Error('AtlasNodeBuilder: label is required');
    if (x === undefined) throw new Error('AtlasNodeBuilder: x座標は必須です');
    if (y === undefined) throw new Error('AtlasNodeBuilder: y座標は必須です');
    if (data === undefined) throw new Error('AtlasNodeBuilder: data is required');
    if (!tags) throw new Error('AtlasNodeBuilder: tags is required');

    return {
      id,
      type,
      dataType,
      label,
      x,
      y,
      parentId: this.node.parentId,
      data,
      tags,
      visible: this.node.visible,
    } as AtlasNodeData;
  }

  /**
   * 静的ファクトリーメソッド: Foundation ノード
   */
  static foundation(id: string): AtlasNodeBuilder {
    return new AtlasNodeBuilder(id).nodeType('foundation');
  }

  /**
   * 静的ファクトリーメソッド: Pattern ノード
   */
  static pattern(id: string): AtlasNodeBuilder {
    return new AtlasNodeBuilder(id).nodeType('pattern');
  }

  /**
   * 静的ファクトリーメソッド: Instance ノード（デフォルトで非表示）
   */
  static instance(id: string): AtlasNodeBuilder {
    return new AtlasNodeBuilder(id).nodeType('instance').hidden();
  }

  /**
   * 静的ファクトリーメソッド: Context ノード
   */
  static context(id: string): AtlasNodeBuilder {
    return new AtlasNodeBuilder(id).nodeType('context');
  }
}
